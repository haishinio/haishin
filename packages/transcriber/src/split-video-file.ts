import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { Worker } from 'worker_threads'
import * as Sentry from '@sentry/node'

import { getDuration } from '@haishin/utils'

import type { SplitVideoFileResponse } from '../types/responses'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5
  })
}

const splitVideoFile = async function (
  filename: string,
  startTime: number,
  duration = 0,
  workerPath = path.join(__dirname, './workers/ffmpeg-splitter.js')
): Promise<SplitVideoFileResponse> {
  const pathToFile = filename

  let durationOfPart = duration
  let nextStartTime = startTime

  if (durationOfPart === 0) {
    // ie. We don't know the duration of the part yet
    const duration = getDuration(pathToFile)

    if (duration !== null) {
      const currentStreamLength = Math.floor(parseFloat(duration))
      nextStartTime = currentStreamLength
      durationOfPart = currentStreamLength - startTime
    } else {
      // TODO: Handle error, ie do nothing and wait for the next attempt
      console.log('Could not get duration of stream, maybe it has ended?')

      return {
        partFileName: '',
        nextStartTime: startTime
      }
    }
  }

  const part = uuidv4({
    random: crypto.getRandomValues(new Uint8Array(16))
  })

  const partFileName = path.join(
    pathToFile,
    pathToFile.includes('uploads') ? '../../' : '../../../',
    `stream-parts/${part}.wav`
  )

  const ffmpegSplitWorker = new Worker(workerPath)

  try {
    ffmpegSplitWorker.postMessage({
      command: 'run',
      pathToFile,
      startTime,
      durationOfPart
    })

    const splitFileData = await new Promise<Buffer>((resolve, reject) => {
      ffmpegSplitWorker.on('message', (message) => {
        if (message.error != null) {
          // We might have already moved the file to backup as stream ended
          Sentry.captureException(message.error)
          reject(new Error(message.error))
        } else {
          resolve(message.output)
        }
      })
      ffmpegSplitWorker.on('error', reject)
      ffmpegSplitWorker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })

    await fs.promises.writeFile(partFileName, splitFileData)
  } catch (error) {
    Sentry.captureException(error)
  }

  ffmpegSplitWorker.postMessage({ command: 'shutdown' })
  ffmpegSplitWorker.terminate()

  return {
    partFileName,
    nextStartTime
  }
}

export default splitVideoFile
