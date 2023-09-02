import fs from 'fs'
import path from 'path'
import { Worker } from 'worker_threads'
import * as Sentry from '@sentry/node'

import { getStreamInfo } from './get-stream-info.js'

import type { StreamDataResponse } from '../types/responses.js'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5
  })
}

function getLatestThumbnailWorker(pathToFile: string, startTime: number): void {
  const thumbnailWorkerPath = path.join(__dirname, './workers/thumbnail.js')

  const thumbnailWorker = new Worker(thumbnailWorkerPath)

  thumbnailWorker.postMessage({
    command: 'thumbnail',
    pathToFile,
    startTime
  })
  thumbnailWorker.on('error', (error) => {
    console.error(error)
  })
  thumbnailWorker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`)
    }
  })
}

export const setupStream = async function (
  originalUrl: string
): Promise<StreamDataResponse> {
  const streamData = await getStreamInfo(originalUrl)

  // If we can't play it or it already exists so just return the streamData and let it be handled
  if (!streamData.canPlay || !streamData.newStream) return streamData

  // Start stream worker
  const streamWorkerPath = path.join(__dirname, './workers/stream.js')
  const thumbnailWorkerPath = path.join(__dirname, './workers/thumbnail.js')
  const streamWorker = new Worker(streamWorkerPath)

  try {
    streamWorker.postMessage({
      command: 'stream',
      streamData
    })

    // eslint-disable-next-line prefer-const
    let thumbnailIntervalId: NodeJS.Timeout
    let thumbnailTime = 100
    const getLatestThumbnail = (): void => {
      if (fs.existsSync(streamData.file)) {
        getLatestThumbnailWorker(streamData.file, thumbnailTime)
        thumbnailTime += 100
      } else {
        clearInterval(thumbnailIntervalId)
      }
    }
    thumbnailIntervalId = setInterval(getLatestThumbnail, 2 * 60 * 1000)

    streamWorker.on('message', (message) => {
      if (message.error != null) {
        console.log({ workerError: message.error })
      } else if (message.thumbnail === true) {
        getLatestThumbnailWorker(streamData.file, 0)
      } else {
        console.log({ workerMessage: message.message })
      }
    })

    streamWorker.on('error', (error) => {
      // Sentry.captureException(error);
      console.log({ workerError: error })
    })

    streamWorker.on('exit', (code) => {
      console.log({ workerExit: code })
    })
  } catch (error) {
    console.log({ error })
    // Sentry.captureException(error);
  }

  return streamData
}

export default setupStream
