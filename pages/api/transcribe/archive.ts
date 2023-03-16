// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'

import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  fileDuration: number
  streamFile: string
}

type Data = {
  transcriptions: string[]
  translations: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query: Query = JSON.parse(req.body)
  const { fileDuration, streamFile } = query
  const partDuration = 10
  
  // Get length of file uploaded if available
  const numOfParts = (fileDuration / partDuration)

  let transcriptionArray = [] as string[]
  let translationArray = [] as string[]
  // For every 10s, split the file and send to whisper and then deepl
  for (let i = 0; i < numOfParts; i++) {
    const startTime = partDuration * i
    const data = await splitTranscribeTranslate(
      streamFile,
      startTime.toString(),
      '10', 
      transcriptionArray.at(-1)
    )
    
    transcriptionArray.push(data.transcription)
    translationArray.push(data.translation)
  }

  // Then group the responses and send to the ui
  res.status(200).json({
    transcriptions: transcriptionArray,
    translations: translationArray
  })
}
