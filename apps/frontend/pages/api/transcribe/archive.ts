// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { secondsToDuration } from '../../../utils/seconds-to-duration'
import { splitVideoFile, transcribeTranslatePart } from '@haishin/transcriber'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { TextLog } from '../../../types/Textlog'

type Query = {
  fileDuration: number
  streamFile: string
}

type Data = {
  textLogs: TextLog[]
}

export const config = {
  api: {
    externalResolver: true,
    responseLimit: false,
  },
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

  const uploadPath = path.join(process.cwd(), '../..', `${streamFile}`)
  const workerPath = path.join(process.cwd(), '../', 'transcriber', 'dist', 'utils', 'ffmpeg-splitter-worker.js')

  let textLogArray = [] as TextLog[]
  // For every 10s, split the file and send to whisper and then deepl
  for (let i = 0; i < numOfParts; i++) {
    const startTime = partDuration * i

    const { partFileName } = await splitVideoFile(uploadPath, startTime, workerPath, partDuration)

    const { transcription, translation } = await transcribeTranslatePart(partFileName, textLogArray.at(-1)?.transcription ?? '')

    textLogArray.push({
      id: uuidv4(),
      time: secondsToDuration(startTime),
      transcription,
      translation,
    })
  }

  // Then group the responses and send to the ui
  res.status(200).json({
    textLogs: textLogArray
  })
}
