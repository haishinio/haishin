import fs from 'fs'
import path from 'path'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { Configuration, OpenAIApi } from "openai"
import * as deepl from 'deepl-node'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(openAiConfig)
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)
const ffmpeg = createFFmpeg({
  // log: true,
})

export default async function splitTranscribeTranslate(
  streamFile = './public/stream.mp4',
  startTime = '0',
  durationOfPart = '10',
  prompt = ''
) {
  const part = parseInt(startTime) / parseInt(durationOfPart)
  const partFileName = `./public/stream-part${part}.wav`
  const pathToFile = path.join(".", streamFile)

  // Get the 10s wav part from the mp4
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  ffmpeg.FS('writeFile', 'stream.mp4', await fetchFile(pathToFile))
  await ffmpeg.run('-y', '-i', 'stream.mp4', '-ss', startTime, '-t', durationOfPart, '-ar', '16000', '-ac', '1', '-acodec', 'pcm_s16le', 'stream.wav')
  await fs.promises.writeFile(partFileName, ffmpeg.FS('readFile', 'stream.wav'))

  if (process.env.APP_ENV === 'faker') {
    fs.unlinkSync(partFileName)
    const fakeResult = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transcription: fakerJP.lorem.words(10),
          translation: fakerGB.lorem.words(10),
        })
      }, fakerGB.datatype.number({ min: 1000, max: 5000 }))
    })
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
  } catch (error) {
    console.log('There was an error in transcription')
    console.log({ error })
  }
  
  // Translate the JP text
  let translation = { text: '' }
  if (transcriptionText !== '') {
    try {
      translation = await translator.translateText(transcriptionText, 'ja', 'en-GB')
    } catch (error) {
      console.log('There was an error in translation')
      console.log({ error })
    }
  }

  // Delete the stream part as we shouldn't need it anymore
  fs.unlinkSync(partFileName)

  // Maybe we should return a new start time here so we the next time we can send it as a duration to go from last startTime to duration

  return {
    transcription: transcriptionText,
    translation: translation.text
  }
}
