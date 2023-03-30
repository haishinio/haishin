// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import exec from 'await-exec'
import { Streamlink } from '@dragongoose/streamlink'
import { format } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'

import * as Sentry from "@sentry/nextjs"

import { faker } from '@faker-js/faker/locale/en_GB'

type Query = {
  url: string
}

type Data = {
  file: string
  streamUrl: string
  url: string
}

function getPathsByUrl(url: string) {
  const paths = url
    .replace('http://', '')
    .replace('https://', '')
    .replace('c:', '')
    .split('/')
  const site = paths.shift()
  
  return {
    site, 
    user: paths.join('-')
  }
}

function setFileName(url: string): string {
  const paths = getPathsByUrl(url)
  const path = `${paths.site}--${paths.user}.mp4`
  return path
}

function setArchivedFileName(url: string): string {
  const dateTimeStart = format(new Date(), 'y-MM-dd_HH-mm-ss')
  const paths = getPathsByUrl(url)
  const path = `${paths.site}--${paths.user}--${dateTimeStart}.mp4`
  return path
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query: Query = JSON.parse(req.body)
  const originalUrl = query.url
  const file = `./public/streams/${setFileName(originalUrl)}`

  // if (process.env.APP_ENV === 'faker') {
  //   return res.status(200).json({
  //     file,
  //     streamUrl: faker.internet.url(),
  //     url: originalUrl,
  //   })
  // }

  // Get the streamUrl
  let {stdout: streamUrl} = await exec(`streamlink "${originalUrl}" best --stream-url`)
  streamUrl = streamUrl.replace('\r\n', '')

  // Try access the file
  try {
    fs.accessSync(file, fs.constants.R_OK)
    // If it exists then return the output
    return res.status(200).json({
      file,
      streamUrl,
      url: originalUrl,
    });
  } catch {
    // If it doesn't exist then start archiving
    const client = new Streamlink(originalUrl, { outputStdout: true })
    const streamFile = fs.createWriteStream(file)
  
    res.status(200).json({
      file,
      streamUrl,
      url: originalUrl,
    });
  
    client.begin()
    client.on('log', data => {
      // console.log('writing to file')
      streamFile.write(data) // puts data into file
    })

    client.on('error', (error: Error) => {
      console.log(error)
      Sentry.captureException(new Error("Streamlink error"), scope => {
        scope.clear()
        scope.setExtra('errObj', error)
        scope.setExtra('streamData', {
          file,
          streamUrl,
          url: originalUrl,
        })
        return scope
      });
    })
  
    client.on('close', () => {
      streamFile.close() // closes the file when the stream ends or is closed
  
      // Move completed file to backups
      fs.copyFileSync(file, `./public/backup/${setArchivedFileName(originalUrl)}`)

      // Delete file in streams
      fs.unlinkSync(file)
    })
  }
}
