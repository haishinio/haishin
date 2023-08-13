import fs from 'fs'
import path from 'path'
import exec from 'await-exec'
import { Worker } from 'worker_threads'

import * as Sentry from '@sentry/node'

import { pathToData, setFileName } from '@haishin/utils'

import type { StreamDataResponse } from '../types/responses.js'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})

export const getStreamInfo = async function (
  originalUrl: string
): Promise<StreamDataResponse> {
  // Should check if we can play the stream at all (ie. use streamlink)
  let canPlay = false

  try {
    await exec(`streamlink --json ${originalUrl} --retry-open 5`)

    canPlay = true
  } catch (error) {
    console.log({ canPlayError: error })
  }

  const streamsDir = pathToData('streams')
  const streamBaseName = setFileName(originalUrl)

  const files = fs.readdirSync(streamsDir)

  let newStream = false
  const [filteredFile] = files.filter((file) => file.includes(streamBaseName))

  console.log({ files, streamBaseName, filteredFile })

  // If we have filteredFile then it's not a newStream
  if (filteredFile === '') newStream = true

  const safeUrl = btoa(originalUrl)
  const streamUrl = `${process.env.RTMP_CLIENT_URL ?? ''}${safeUrl}.flv`

  const file = pathToData(`streams/${streamBaseName}.mp4`)

  return {
    // Utils
    canPlay,
    newStream,
    // Name
    baseName: streamBaseName,
    // Urls
    originalUrl,
    streamUrl,
    file
  }
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
