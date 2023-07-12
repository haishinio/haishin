import fs from 'fs'
import { Streamlink } from '@dragongoose/streamlink'
import { format } from 'date-fns'
import * as Sentry from "@sentry/node"

import streamToUI from "./stream-to-client"
import { getPathsByUrl, setFileName } from "@haishin/transcriber-utils"
import pathToData from './utils/path-to-data'

import type { NewStreamDataResponse, StreamDataResponse } from '../types/responses.js'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

function setArchivedFileName(url: string): string {
  const dateTimeStart = format(new Date(), 'y-MM-dd_HH-mm-ss');
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}--${dateTimeStart}.mp4`;
  return path;
}

export const getStreamInfo = async function (originalUrl: string): Promise<StreamDataResponse> {
  const streamUrl = `streams/${setFileName(originalUrl)}`;
  const file = pathToData(streamUrl);

  return {
    file,
    originalUrl,
    streamUrl,
  };
}

export const setupStream = async function (originalUrl: string): Promise<NewStreamDataResponse> {
  const streamData = await getStreamInfo(originalUrl);

  try {
    // If it exists then continue on!
    fs.accessSync(streamData.file, fs.constants.R_OK)

    return {
      ...streamData,
      newStream: false,
    };
  } catch {
    // If it doesn't exist then start the archiving process
    console.log('Start archiving stream')
    const client = new Streamlink(originalUrl, { outputStdout: true })
    const streamFile = fs.createWriteStream(streamData.file)

    client.begin()
    client.on('log', data => {
      // console.log('writing to file')
      streamFile.write(data) // puts data into file
    })

    client.on('error', (error: Error) => {
      Sentry.captureException(error);
    })

    // Will need to find a way to kill this exec later...
    const streamToUITimeout = setTimeout(() => {
      // Send stream to rtmp server
      try {
        const streamKey = setFileName(originalUrl).replace('.mp4', '');
        streamToUI(streamData.file, streamKey);
        // exec(`ffmpeg -re -stream_loop -1 -i ${streamData.file} -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/${streamKey}`);
        // exec(`ffmpeg -re -i ${streamBuffer} -c:v copy -c:a copy -f flv rtmp://localhost/live/${streamKey}`);
      } catch (error) {
        Sentry.captureException(error);
      }
    }, 15000);
  
    client.on('close', () => {
      streamFile.close() // closes the file when the stream ends or is closed
  
      // Move completed file to backups
      fs.copyFileSync(
        streamData.file,
        pathToData(`/backups/${setArchivedFileName(originalUrl)}`)
      )

      // Delete file in streams
      setTimeout(() => {
        clearTimeout(streamToUITimeout);
        fs.unlinkSync(streamData.file)
      }, 1000 * 60 * 2) // 2 minutes after stream ends delete the file
    })

    return {
      ...streamData,
      streamLinkClient: client,
      newStream: true,
    };
  }
}

export default setupStream;
