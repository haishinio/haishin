import fs from 'fs'
import { spawn } from "child_process";
import { format } from 'date-fns'
import { Streamlink } from '@dragongoose/streamlink';
import * as Sentry from "@sentry/node"

// import streamToUI from "./stream-to-client"
import { getPathsByUrl, setFileName } from "@haishin/transcriber-utils"
import pathToData from './utils/path-to-data'

import type { StreamDataResponse } from '../types/responses.js'

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

export const getStreamInfo = function (originalUrl: string): StreamDataResponse {
  const streamsDir = pathToData('streams');
  const streamBaseName = setFileName(originalUrl);

  const files = fs.readdirSync(streamsDir);

  let port = '25565';
  let newStream = true;
  const [filteredFile] = files.filter(file => file.includes(streamBaseName));

  // If we have filteredFile then it's not a newStream
  if (filteredFile) {
    port = filteredFile.split('__')[0];
    newStream = false;
  }

  const streamUrl = `streams/${port}__${streamBaseName}`;
  const file = pathToData(streamUrl);

  return {
    newStream,
    port,
    file,
    originalUrl,
    streamUrl,
  };
}

export const setupStream = async function (originalUrl: string): Promise<StreamDataResponse> {
  const streamData = getStreamInfo(originalUrl);

  // It exists so return the streamData
  if (!streamData.newStream) return streamData;

  // If it doesn't exist then start the archiving process
  console.log('Start restreaming');
  spawn('streamlink', [
    originalUrl,
    'best',
    '--player-external-http',
    '--player-external-http-port', streamData.port,
    '--player-external-http-continuous', 'false'
  ]);

  // If it doesn't exist then start the archiving process
  console.log('Start archiving stream');
  const streamFile = fs.createWriteStream(streamData.file);
  const client = new Streamlink(originalUrl, {outputStdout: true});
  client.begin();
  client.on('log', data => {
    // console.log('writing to file')
    streamFile.write(data) // puts data into file
  });

  client.on('error', (error: Error) => {
    Sentry.captureException(error);
  });

  client.on('close', () => {
    // Close the file when the stream ends or is closed
    streamFile.close();

    // Move completed file to backups
    fs.copyFileSync(
      streamData.file,
      pathToData(`/backups/${setArchivedFileName(originalUrl)}`)
    );

    // Delete file in streams
    setTimeout(() => {
      fs.unlinkSync(streamData.file)
    }, 1000 * 60 * 2) // 2 minutes after stream ends delete the file
  });

  return streamData;
}

export default setupStream;
