// Calls worker to split the stream into an audio chunk
// Sends this chunk to openAI + deepL
// Sends this transcription and translation to the client via websocket

import fs from 'node:fs'
import splitter from './splitter'

export const transcribeStream = async (
  ws: any, // Would be nice to fix these types
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
      void transcribeStream(ws, redisClient, url, file, startTime, prompt)
    }, 5000)
  }

  // Split the stream into a part
  console.log('Splitting the stream into an audio part')
  const { partFileName, nextStartTime } = await splitter(file, startTime)

  console.log({ partFileName, nextStartTime })

  // Send this part to opeanAi for transcription

  // As we have the transcription, we don't need the part any more so delete it
  // if (partFileName) {
  //   console.log("Deleting the part file");
  //   fs.unlinkSync(partFileName);
  // }

  // Send this transcription to deepL for translation

  // Send the transcription and translation to the client

  // Repeat
  console.log('And repeat in a few seconds...')
  setTimeout(() => {
    void transcribeStream(ws, redisClient, url, file, nextStartTime, prompt)
  }, 5000)
}
