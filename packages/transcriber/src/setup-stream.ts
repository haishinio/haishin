import fs from 'fs'
import exec from 'await-exec'
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { format } from 'date-fns'
import * as Sentry from "@sentry/node"

import { getPathsByUrl, isRtmpSite, setFileName } from "@haishin/transcriber-utils"
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

export const getStreamInfo = async function (originalUrl: string): Promise<StreamDataResponse> {
  // Should check if we can play the stream at all (ie. use streamlink)
  const canPlay = await exec(`streamlink --can-handle-url ${originalUrl}`);

  console.log({ canPlay });

  const streamsDir = pathToData('streams');
  const streamBaseName = setFileName(originalUrl);

  const files = fs.readdirSync(streamsDir);

  let newStream = true;
  const [filteredFile] = files.filter(file => file.includes(streamBaseName));

  // If we have filteredFile then it's not a newStream
  if (filteredFile) {
    newStream = false;
  }

  let streamUrl = originalUrl;
  if (isRtmpSite(originalUrl)) {
    streamUrl = `http://localhost:8000/live/${streamBaseName}.flv`;
  }

  const file = pathToData(`streams/${streamBaseName}.mp4`);

  return {
    canPlay,
    newStream,
    originalUrl,
    baseName: streamBaseName,
    streamUrl,
    file,
  };
}

export const setupStream = async function (originalUrl: string): Promise<StreamDataResponse> {
  const streamData = await getStreamInfo(originalUrl);

  // Need to probably handle if we can't play the stream
  // if (!streamData.canPlay) {}

  // It exists so return the streamData
  if (!streamData.newStream) return streamData;

  // If it doesn't exist then start the archiving process
  let streamLinkMode = '-o';
  if (isRtmpSite(originalUrl)) {
    streamLinkMode = '-R';
  }

  console.log({streamLinkMode});

  const streamlinkArgs = [originalUrl, 'best', streamLinkMode, streamData.file, '-f'];
  const streamlinkProcess = spawn('streamlink', streamlinkArgs);

  streamlinkProcess.on('error', (err) => {
    console.error('Streamlink error:', err);
  });

  streamlinkProcess.on('close', (code) => {
    // Move completed file to backups
    fs.copyFileSync(
      streamData.file,
      pathToData(`/backups/${setArchivedFileName(originalUrl)}`)
    );

    // Delete file in streams
    setTimeout(() => {
      fs.unlinkSync(streamData.file)
    }, 1000 * 60 * 2) // 2 minutes after stream ends delete the file

    console.log(`Streamlink process exited with code ${code}`);
  });

  // We only want to stream if it's a showroom or twitcasting stream
  if (isRtmpSite(originalUrl)) {
    console.log('Starting restreamer...');
    console.log(streamData.baseName);

    const ffmpegArgs = ['-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency', '-c:a', 'aac', '-ar', '44100', '-f', 'flv', `rtmp://localhost/live/${streamData.baseName}`]
    
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
  
    streamlinkProcess.stdout.pipe(ffmpegProcess.stdin);
  
    ffmpegProcess.on('error', (err) => {
      console.error('FFmpeg error:', err);
    });
  
    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      streamlinkProcess.kill();
    });
  }

  return streamData;
}

export default setupStream;
