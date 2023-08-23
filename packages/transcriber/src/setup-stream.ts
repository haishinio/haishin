import path from 'path'
import { Worker } from 'worker_threads'
import * as Sentry from '@sentry/node'

import { getStreamInfo } from './get-stream-info.js'

import type { StreamDataResponse } from '../types/responses.js'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  })
}

export const setupStream = async function (
  originalUrl: string
): Promise<StreamDataResponse> {
  const streamData = await getStreamInfo(originalUrl)

  // If we can't play it or it already exists so just return the streamData and let it be handled
  if (!streamData.canPlay || !streamData.newStream) return streamData

  // Start stream worker
  const workerPath = path.join(__dirname, './workers/stream.js')
  const streamWorker = new Worker(workerPath)

  try {
    streamWorker.postMessage({
      command: 'stream',
      streamData
    })

    streamWorker.on('message', (message) => {
      if (message.error != null) {
        console.log({ workerError: message.error })
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
