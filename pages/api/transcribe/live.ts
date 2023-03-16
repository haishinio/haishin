// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'
import type { NextApiRequest, NextApiResponse } from 'next'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

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
  if (process.env.APP_ENV === 'faker') {
    return res.status(200).json({
      transcription: fakerJP.lorem.words(10),
      translation: fakerGB.lorem.words(10),
    })
  }

  const {
    streamFile,
    startTime,
    duration,
    prompt,
  }: Query = JSON.parse(req.body)

  const data = await splitTranscribeTranslate(streamFile, startTime, duration, prompt)

  // Stream the JP and EN text?
  res.status(200).json({
    transcription: data.transcription,
    translation: data.translation
  })
}
