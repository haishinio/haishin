import fs from 'node:fs'
import path from 'node:path'

import OpenAI from 'openai'
import * as deepl from 'deepl-node'
import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'
import { getDuration } from '@haishin/utils'

import { simulataneousJobs, transcribingQueue } from './shared'
import { streamPartsFolder } from '../routes/streams'

export interface TranscriptionResponse {
  _file: string
  _prompt: string
  _startTime: number
  _viewers: number
  socketData?: {
    type: string
    content: {
      id: string
      startTime: number
      transcription: string
      translation: string
    }
  }
}

const options = {
  removeOnSuccess: true,
  redis: {
    url: process.env.REDIS_URL
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)

transcribingQueue.process(simulataneousJobs, async (job: any) => {
  const { file, prompt, startTime, viewers } = job.data
  let response: TranscriptionResponse = {
    _file: file,
    _prompt: prompt,
    _startTime: startTime,
    _viewers: viewers
  }

  // Get the duration of file
  const durationOfFile = getDuration(file)

  // If the duration is null, return an empty partFileName and the startTime to try again later
  if (durationOfFile === null) return response

  // Get the duration of this part (time since last transcription)
  const durationOfPart = durationOfFile - startTime

  // If the duration of this part is less than 0 or 0, return an empty partFileName and the startTime to try again later
  if (durationOfPart <= 0) return response

  // Setup the partFileName
  if (!fs.existsSync(streamPartsFolder)) {
    fs.mkdirSync(streamPartsFolder)
  }
  const partFileName = path.join(
    streamPartsFolder,
    `${crypto.randomUUID()}.wav`
  )

  // Use ffmpeg to split the stream
  const ffmpegArgs = [
    '-i',
    'pipe:0',
    '-ss',
    startTime.toString(),
    '-t',
    durationOfPart.toString(),
    '-acodec',
    'pcm_s16le',
    '-ar',
    '44100',
    '-ac',
    '1',
    '-hide_banner',
    '-loglevel',
    'error',
    partFileName
  ]

  const ffmpegSplitterProcess = Bun.spawn(['ffmpeg', ...ffmpegArgs], {
    stdin: Bun.file(file)
  })

  // We know we have the file when the ffmpeg process exits
  await ffmpegSplitterProcess.exited

  // Get the next start time
  const nextStartTime = startTime + durationOfPart

  if (fs.existsSync(partFileName)) {
    // Check for viewers, if no viewers then skip this transcription + translation
    if (viewers > 0) {
      // Send this part to opeanAi for transcription
      let transcriptionText = ''
      try {
        if (process.env.APP_ENV === 'faker') {
          transcriptionText = fakerJP.lorem.words(10)
        } else {
          const transcription = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: fs.createReadStream(partFileName),
            prompt,
            language: 'ja',
            response_format: 'json',
            temperature: 0
          })
          transcriptionText = transcription.text
        }
      } catch (error: unknown) {
        console.error({ error })
      }

      // As we have the transcription, we don't need the part any more so delete it
      fs.unlinkSync(partFileName)

      // Send this transcription to deepL for translation
      let translation = { text: '' }
      if (transcriptionText !== '') {
        try {
          if (process.env.APP_ENV === 'faker') {
            translation.text = fakerGB.lorem.words(10)
          } else {
            translation = await translator.translateText(
              transcriptionText,
              'ja',
              'en-GB'
            )
          }
        } catch (error: unknown) {
          console.error({ error })
        }
      }

      // Send the transcription and translation to the client
      response = {
        _file: file,
        _prompt: transcriptionText,
        _startTime: nextStartTime,
        _viewers: viewers,
        socketData: {
          type: 'transcription-translation',
          content: {
            id: crypto.randomUUID(),
            startTime: nextStartTime,
            transcription: transcriptionText,
            translation: translation.text
          }
        }
      }
    } else {
      // Delete the part as we don't need it
      fs.unlinkSync(partFileName)

      response = {
        _file: file,
        _prompt: prompt,
        _startTime: nextStartTime,
        _viewers: viewers
      }
    }
  }

  if (process.env.APP_ENV === 'faker') {
    await Bun.sleep(fakerGB.number.int({ min: 1000, max: 5000 }))
  }

  return response
})
