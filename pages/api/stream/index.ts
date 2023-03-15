// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import { Streamlink } from '@dragongoose/streamlink'
import { format } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  url: string
}

type Data = {
  file: string
  url: string
}

function setFileName(url: string): string {
  const dateTimeStart = format(new Date(), 'y-MM-dd_HH-mm-ss')
  const paths = url
    .replace('https://', '')
    .replace('c:', '')
    .split('/')
  const path = `${paths[0]}--${paths[1]}--${dateTimeStart}.mp4`
  return path
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query: Query = JSON.parse(req.body)
  const originalUrl = query.url
  const file = `./public/streams/${setFileName(originalUrl)}`

  const client = new Streamlink(originalUrl, { outputStdout: true })
  const streamFile = fs.createWriteStream(file)

  res.status(200).json({
    file,
    url: originalUrl,
  });

  client.begin()
  client.on('log', data => {
    // console.log('writing to file')
    streamFile.write(data) // puts data into file
  })

  client.on('close', () => {
    streamFile.close() // closes the file when the stream ends or is closed
  })
}
