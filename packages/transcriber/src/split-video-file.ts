import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import ffprobe from 'node-ffprobe'
import { v4 as uuidv4 } from 'uuid'
import { Worker } from 'worker_threads'
import * as Sentry from "@sentry/node"

import { SplitVideoFileResponse } from '../types/responses'

const splitVideoFile = async function (filename: string, startTime: number, duration = 0, workerPath = path.join(__dirname, './worker.js')): Promise<SplitVideoFileResponse> {
  const pathToFile = filename

  let durationOfPart = duration
  let nextStartTime = startTime

  if (durationOfPart === 0) {
    // ie. We don't know the duration of the part yet
    const probeData = await ffprobe(pathToFile)
  
    if (!probeData.error) {
      const currentStreamLength = parseInt(probeData.format.duration)
      nextStartTime = currentStreamLength
      durationOfPart = (currentStreamLength - startTime)
    } else {
      // TODO: Handle error, ie do nothing and wait for the next attempt
      Sentry.captureException('Could not get duration of stream');
    }
  }

  const part = uuidv4({
    random: crypto.getRandomValues(new Uint8Array(16))
  })  
  const partFileName = path.join(pathToFile, '../../', `stream-parts/${part}.wav`)

  const ffmpegSplitWorker = new Worker(workerPath);

  try {
    ffmpegSplitWorker.postMessage({ 
      command: 'run', 
      pathToFile, startTime, durationOfPart
    });
  
    const splitFileData = await new Promise<Buffer>((resolve, reject) => {
      ffmpegSplitWorker.on('message', (message) => {
        if (message.error) {
          // We might have already moved the file to backup as stream ended
          Sentry.captureException(message.error);
          reject(new Error(message.error));
        } else {
          resolve(message.output);
        }
      });
      ffmpegSplitWorker.on('error', reject);
      ffmpegSplitWorker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  
    await fs.promises.writeFile(partFileName, splitFileData)
  } catch (error) {
    Sentry.captureException(error);
  }

  await ffmpegSplitWorker.terminate();

  return {
    partFileName,
    nextStartTime
  }
}

export default splitVideoFile;
