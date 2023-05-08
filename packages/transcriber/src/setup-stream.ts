import fs from 'fs'
import exec from 'await-exec'
import { Streamlink } from '@dragongoose/streamlink'
import { format } from 'date-fns'
import * as Sentry from "@sentry/node"

import pathToData from './utils/path-to-data'

import type { StreamDataResponse } from '../types/responses.js'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

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
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}.mp4`;
  return path;
}

function setArchivedFileName(url: string): string {
  const dateTimeStart = format(new Date(), 'y-MM-dd_HH-mm-ss');
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}--${dateTimeStart}.mp4`;
  return path;
}

const setupStream = async function (originalUrl: string): Promise<StreamDataResponse> {
  const file = pathToData(`/streams/${setFileName(originalUrl)}`);

  let streamUrl = ''
  try {
    streamUrl = await exec(`streamlink "${originalUrl}" best --stream-url`).stdout;
    streamUrl = streamUrl.replace('\r\n', '');
  } catch (error) {
    // Could not get the actual streamUrl (Only really needed for SHOWROOM)
    Sentry.captureException(error);
  }

  try {
    fs.accessSync(file, fs.constants.R_OK)
    // If it exists then return the output
    return {
      newStream: false,
      file,
      originalUrl,
      streamUrl,
    };
    // DO SOMETHING
  } catch {
    console.log('Start archiving stream')
    const client = new Streamlink(originalUrl, { outputStdout: true })
    const streamFile = fs.createWriteStream(file)

    client.begin()
    client.on('log', data => {
      // console.log('writing to file')
      streamFile.write(data) // puts data into file
    })

    client.on('error', (error: Error) => {
      Sentry.captureException(error);
    })
  
    client.on('close', () => {
      streamFile.close() // closes the file when the stream ends or is closed
  
      // Move completed file to backups
      fs.copyFileSync(
        file,
        pathToData(`/backups/${setArchivedFileName(originalUrl)}`)
      )

      // Delete file in streams
      fs.unlinkSync(file)
    })

    return {
      newStream: true,
      file,
      originalUrl,
      streamUrl,
    };
  }
}

export default setupStream;
