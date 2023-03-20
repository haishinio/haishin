// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'
import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  streamFile: string
  startTime: string
  splitTime: string
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
    splitTime,
    prompt,
  }: Query = JSON.parse(req.body)

  const data = await splitTranscribeTranslate(streamFile, startTime, splitTime, prompt)

  // Stream the JP and EN text?
  res.status(200).json({
    transcription: data.transcription,
    translation: data.translation
  })
}
