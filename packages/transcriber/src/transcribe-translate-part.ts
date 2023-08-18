import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import * as deepl from 'deepl-node'
import * as Sentry from '@sentry/node'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

import type { TranscriberResponse } from '../types/responses'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  })
}

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(openAiConfig)
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
    const transcription = await openai.createTranscription(
      fs.createReadStream(filename) as unknown as File,
      'whisper-1',
      prompt,
      'json',
      0,
      'ja'
    )
    transcriptionText = transcription.data.text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  return {
    transcription: transcriptionText,
    translation: translation.text
  }
}

export default transcribeTranslatePart
