// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'
import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  streamFile: string
  startTime: string
  duration: string
  prompt: string
}

type Data = {
  transcription: string
  translation: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    streamFile,
    startTime,
    duration,
    prompt,
  }: Query = JSON.parse(req.body)

  console.log({
    streamFile,
    startTime,
    duration,
    prompt,
  })

  const data = await splitTranscribeTranslate(streamFile, startTime, duration, prompt)

  console.log({ data })

  // Stream the JP and EN text?
  res.status(200).json({
    transcription: data.transcription,
    translation: data.translation
  })
}
