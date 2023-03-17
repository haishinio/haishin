// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { v4 as uuidv4 } from 'uuid'
import splitTranscribeTranslate from '../../../utils/split-transcribe-translate'

import { faker as fakerGB } from '@faker-js/faker/locale/en_GB'
import { faker as fakerJP } from '@faker-js/faker/locale/ja'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { TextLog } from '../../../types/Textlog'

type Query = {
  fileDuration: number
  streamFile: string
}

type Data = {
  textLogs: TextLog[]
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

  let textLogArray = [] as TextLog[]
  // For every 10s, split the file and send to whisper and then deepl
  for (let i = 0; i < numOfParts; i++) {
    const startTime = partDuration * i

    let data = { transcription: '', translation: '' }
    if (process.env.APP_ENV !== 'faker') {
      data = await splitTranscribeTranslate(
        streamFile,
        startTime.toString(),
        '10', 
        textLogArray.at(-1)?.transcription ?? ''
      )
    } else {
      data = {
        transcription: fakerJP.lorem.words(10),
        translation: fakerGB.lorem.words(10),
      }
    }

    textLogArray.push({
      id: uuidv4(),
      time: startTime.toString(),
      transcription: data.transcription,
      translation: data.translation
    })
  }

  // Then group the responses and send to the ui
  res.status(200).json({
    textLogs: textLogArray
  })
}
