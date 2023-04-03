import fs from 'fs'
import { Configuration, OpenAIApi } from "openai"
import * as deepl from 'deepl-node'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(openAiConfig)
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)

interface Response {
  transcription: string
  translation: string
}

const transcribeTranslatePart = async function (filename: string, prompt: string) {
  if (process.env.APP_ENV === 'faker') {
    const fakeResult = await new Promise<Response>((resolve) => {
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
    console.error(error)
  }
  
  // Translate the JP text
  let translation = { text: '' }
  if (transcriptionText !== '') {
    try {
      translation = await translator.translateText(transcriptionText, 'ja', 'en-GB')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    transcription: transcriptionText,
    translation: translation.text
  } as Response
}

export default transcribeTranslatePart;
