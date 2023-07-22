import fs from 'fs'
import exec from 'await-exec'
import { spawn } from "child_process";
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
  let canPlay = false;

  try {
    await exec(`streamlink --json ${originalUrl} --retry-open 5`);

    canPlay = true;
  } catch (error) {
    console.log({ canPlayError: error });
  }

  const streamsDir = pathToData('streams');
  const streamBaseName = setFileName(originalUrl);

  const files = fs.readdirSync(streamsDir);

  let newStream = false;
  const [filteredFile] = files.filter(file => file.includes(streamBaseName));

  console.log({files, streamBaseName, filteredFile});

  // If we have filteredFile then it's not a newStream
  if (!filteredFile) newStream = true;

  let streamUrl = originalUrl;
  if (isRtmpSite(originalUrl)) {
    streamUrl = `${process.env.RTMP_CLIENT_URL}${streamBaseName}.flv`;
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

  // If we can't play it or it already exists so just return the streamData and let it be handled
  if (!streamData.canPlay || !streamData.newStream) return streamData;

  // If it doesn't exist then start the archiving process
  let streamLinkMode = '-o';
  if (isRtmpSite(originalUrl)) {
    streamLinkMode = '-R';
  }

  console.log({streamLinkMode, streamData});

  const streamlinkArgs = [originalUrl, 'best', streamLinkMode, streamData.file, '-f', '--retry-open', '5'];
  const streamlinkProcess = spawn('streamlink', streamlinkArgs);

  streamlinkProcess.stderr.on('data', (data) => {
    // Handle the error output, if any
    console.error(data.toString());
  });

  streamlinkProcess.on('close', (code) => {
    // Move completed file to backups
    try {
      fs.copyFileSync(
        streamData.file,
        pathToData(`/backups/${setArchivedFileName(originalUrl)}`)
      );
  
      // Delete file in streams
      setTimeout(() => {
        fs.unlinkSync(streamData.file)
      }, 1000 * 60 * 2) // 2 minutes after stream ends delete the file
    } catch {
      console.log('Could not remove file');
    }

    console.log(`Streamlink process exited with code ${code}`);
  });

  // We only want to stream if it's a showroom or twitcasting stream
  if (isRtmpSite(originalUrl)) {
    console.log('Starting restreamer...');
    const rtmpServer = `${process.env.RTMP_SERVER_URL}${streamData.baseName}`;

    const ffmpegArgs = ['-re','-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency', '-c:a', 'aac', '-ar', '44100', '-f', 'flv', rtmpServer]
    
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
  
    streamlinkProcess.stdout.pipe(ffmpegProcess.stdin);
  
    // ffmpegProcess.stderr.on('data', (data) => {
    //   // Handle the error output, if any
    //   console.error(data.toString());
    // });
  
    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      streamlinkProcess.kill();
    });
  }

  return streamData;
}

export default setupStream;
