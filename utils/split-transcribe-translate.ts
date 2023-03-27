import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import PQueue from 'p-queue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import probe from 'node-ffprobe'

import { Configuration, OpenAIApi } from "openai"
import * as deepl from 'deepl-node'

import * as Sentry from "@sentry/nextjs"
import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

const queue = new PQueue({concurrency: 1})
const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(openAiConfig)
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)
const ffmpeg = createFFmpeg({
  // log: true,
  corePath: '@ffmpeg/core',
})

interface Response {
  nextStartTime: number
  transcription: string
  translation: string
}

export default async function splitTranscribeTranslate(
  streamFile = './public/stream.mp4',
  startTime = 0,
  prompt = '',
  duration = 0
) {
  const pathToFile = path.join('.', streamFile)

  let durationOfPart = duration
  let nextStartTime = startTime + duration
  if (!duration) {
    probe.sync = true
    const probeData = await probe(pathToFile)

    if (!probeData.error) {
      const currentStreamLength = probeData.format.duration
      nextStartTime = currentStreamLength
      durationOfPart = (currentStreamLength - startTime)
    }
  }

  if (durationOfPart === 0) {
    return {
      nextStartTime: startTime + 1,
      transcription: '',
      translation: ''
    } as Response
  }

  const part = uuidv4()
  const partFileName = `./public/stream-part-${part}.wav`

  // Get the 10s wav part from the mp4
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  await queue.add(async () => {
    ffmpeg.FS('writeFile', 'stream.mp4', await fetchFile(pathToFile))
    await ffmpeg.run('-y', '-i', 'stream.mp4', '-ss', startTime.toString(), '-t', durationOfPart.toString(), '-ar', '16000', '-ac', '1', '-acodec', 'pcm_s16le', 'stream.wav')
    await fs.promises.writeFile(partFileName, ffmpeg.FS('readFile', 'stream.wav'))
  });

  if (process.env.APP_ENV === 'faker') {
    const fakeResult = await new Promise<Response>((resolve) => {
      setTimeout(() => {
        resolve({
          nextStartTime: nextStartTime,
          transcription: fakerJP.lorem.words(10),
          translation: fakerGB.lorem.words(10),
        })
      }, fakerGB.datatype.number({ min: 1000, max: 5000 }))
    })
    fs.unlinkSync(partFileName)
    return fakeResult
  }
  
  // Transcribe into JP text
  let transcriptionText = ''
  try {
    const transcription = await openai.createTranscription(
      fs.createReadStream(partFileName) as unknown as File,
      'whisper-1',
      prompt,
      'json',
      0,
      'ja'
    )
    transcriptionText = transcription.data.text
  } catch (error: any) {
    Sentry.captureException(new Error("Transcription failed"), scope => {
      scope.clear()
      scope.setExtra('streamData', {
        streamFile,
        startTime,
        duration,
        nextStartTime,
        prompt,
        partFileName
      })
      return scope
    });
  }
  
  // Translate the JP text
  let translation = { text: '' }
  if (transcriptionText !== '') {
    try {
      translation = await translator.translateText(transcriptionText, 'ja', 'en-GB')
    } catch (error) {
      Sentry.captureException(new Error("Translation failed"), scope => {
        scope.clear()
        scope.setExtra('streamData', {
          streamFile,
          startTime,
          duration,
          nextStartTime,
          prompt,
          partFileName
        })
        return scope
      });
    }
  }

  // Delete the stream part as we shouldn't need it anymore
  fs.unlinkSync(partFileName)

  return {
    nextStartTime: nextStartTime,
    transcription: transcriptionText,
    translation: translation.text
  } as Response
}
