// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'

import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  streamFile: string | File
}

type Data = {
  transcriptions: string[]
  translations: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const {
  //   streamFile: streamFile
  // } = req.query as Query

  const streamFile = './public/stream.mp4' //TEMP, to replace with file upload or downloaded link
  
  // Get length of file uploaded if available
  const duration = '10';

  let transcriptionArray = [] as string[]
  let translationArray = [] as string[]
  // For every 10s, split the file and send to whisper and then deepl
  splitTranscribeTranslate(streamFile, '0', duration, transcriptionArray.at(-1))

  // Then group the responses and send to the ui
  res.status(200).json({
    transcriptions: transcriptionArray,
    translations: translationArray
  })
}
