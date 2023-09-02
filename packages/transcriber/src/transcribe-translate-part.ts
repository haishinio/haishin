import fs from 'fs'
import OpenAI from 'openai'
import * as deepl from 'deepl-node'
import * as Sentry from '@sentry/node'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

import type { TranscriberResponse } from '../types/responses'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5
  })
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)

const transcribeTranslatePart = async function (
  filename: string,
  prompt: string
): Promise<TranscriberResponse> {
  if (process.env.APP_ENV === 'faker') {
    const fakeResult = await new Promise<TranscriberResponse>((resolve) => {
      setTimeout(
        () => {
          resolve({
            transcription: fakerJP.lorem.words(10),
            translation: fakerGB.lorem.words(10)
          })
        },
        fakerGB.number.int({ min: 1000, max: 5000 })
      )
    })
    return fakeResult
  }

  // Transcribe into JP text
  let transcriptionText = ''
  try {
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: fs.createReadStream(filename),
      prompt,
      language: 'ja',
      response_format: 'json',
      temperature: 0
    })
    transcriptionText = transcription.text
  } catch (error: unknown) {
    console.log({ error })
    Sentry.captureException(error)
  }

  // Translate the JP text
  let translation = { text: '' }
  if (transcriptionText !== '') {
    try {
      translation = await translator.translateText(
        transcriptionText,
        'ja',
        'en-GB'
      )
    } catch (error: unknown) {
      console.log({ error })
      Sentry.captureException(error)
    }
  }

  return {
    transcription: transcriptionText,
    translation: translation.text
  }
}

export default transcribeTranslatePart
