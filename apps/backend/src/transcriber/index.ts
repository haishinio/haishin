// Calls worker to split the stream into an audio chunk
// Sends this chunk to openAI + deepL
// Sends this transcription and translation to the client via websocket

import fs from 'node:fs'

import OpenAI from 'openai'
import * as deepl from 'deepl-node'

import splitter from './splitter'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)

export const transcribeStream = async (
  server: any, // Would be nice to fix these types
  redisClient: any, // Would be nice to fix these types
  url: string,
  file: string,
  startTime = 0,
  prompt = ''
): Promise<void> => {
  // If the streamFile isn't present, stop transcribing
  if (!fs.existsSync(file)) return

  const currentUsers = await redisClient.sCard(`users:${url}`)

  // If no one is watching the stream, don't transcribe it
  if (currentUsers <= 0) {
    console.log('No one is watching the stream, try again in 5 seconds')
    setTimeout(() => {
      void transcribeStream(server, redisClient, url, file, startTime, prompt)
    }, 5000)
  }

  // Split the stream into a part
  console.log('Splitting the stream into an audio part')
  const { partFileName, nextStartTime } = await splitter(file, startTime)

  if (partFileName !== '') {
    console.log({ partFileName, nextStartTime })

    // Send this part to opeanAi for transcription
    let transcriptionText = ''
    try {
      const transcription = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(partFileName),
        prompt,
        language: 'ja',
        response_format: 'json',
        temperature: 0
      })
      transcriptionText = transcription.text
    } catch (error: unknown) {
      console.error({ error })
    }

    // As we have the transcription, we don't need the part any more so delete it
    if (partFileName) {
      console.log('Deleting the part file')
      fs.unlinkSync(partFileName)
    }

    // Send this transcription to deepL for translation
    let translation = { text: '' }
    if (transcriptionText !== '') {
      try {
        translation = await translator.translateText(
          transcriptionText,
          'ja',
          'en-GB'
        )
      } catch (error: unknown) {
        console.error({ error })
      }
    }

    console.log({ transcriptionText, translation: translation.text })

    // Send the transcription and translation to the client
    const message = JSON.stringify({
      type: 'transcription-translation',
      content: {
        id: crypto.randomUUID(),
        startTime: startTime,
        transcription: transcriptionText,
        translation: translation.text
      }
    })
    server.publish(url, message)
  }

  // Repeat
  console.log('And repeat in a few seconds...')
  setTimeout(() => {
    void transcribeStream(server, redisClient, url, file, nextStartTime, prompt)
  }, 5000)
}
