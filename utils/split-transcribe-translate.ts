import fs from 'fs'
import path from 'path'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { Configuration, OpenAIApi } from "openai"
import * as deepl from 'deepl-node'

const openAiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(openAiConfig)
const translator = new deepl.Translator(process.env.DEEPL_API_KEY as string)
const ffmpeg = createFFmpeg({
  log: true,
})

export default async function splitTranscribeTranslate(
  streamFile = './public/stream.mp4',
  startTime = '0',
  duration = '10',
  prompt = ''
) {
  const part = parseInt(startTime) / parseInt(duration)
  const partFileName = `./public/stream-part${part}.wav`
  const pathToFile = path.join(".", streamFile)

  console.log({ partFileName })

  // Get the 10s wav part from the mp4
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  ffmpeg.FS('writeFile', 'stream.mp4', await fetchFile(pathToFile))
  await ffmpeg.run('-y', '-i', 'stream.mp4', '-ss', startTime, '-t', duration, '-ar', '16000', '-ac', '1', '-acodec', 'pcm_s16le', 'stream.wav')
  await fs.promises.writeFile(partFileName, ffmpeg.FS('readFile', 'stream.wav'))
  
  // Transcribe into JP text
  const transcription = await openai.createTranscription(
    fs.createReadStream(partFileName) as unknown as File,
    'whisper-1',
    prompt,
    'json',
    0,
    'ja'
  )
  const transcriptionText = transcription.data.text
  
  // Translate the JP text
  const translation = await translator.translateText(transcriptionText, 'ja', 'en-GB')

  // Delete the stream part as we shouldn't need it anymore
  fs.unlinkSync(partFileName)

  return {
    transcription: transcriptionText,
    translation: translation.text
  }
}
