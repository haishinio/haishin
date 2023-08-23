import fs from 'fs'
import { parentPort } from 'worker_threads'
import { spawn } from 'child_process'
import { pathToData, setArchivedFileName, urlUtils } from '@haishin/utils'

import type { ChildProcessWithoutNullStreams } from 'child_process'
import type { StreamDataResponse } from '../../types/responses'

let streamlinkProcess: ChildProcessWithoutNullStreams

async function stream(streamData: StreamDataResponse): Promise<void> {
  const streamLinkMode = '-R'

  parentPort?.postMessage({ message: `Streamlink mode: ${streamLinkMode}` })

  const streamlinkArgs = [
    streamData.originalUrl,
    '--default-stream',
    'best',
    streamLinkMode,
    streamData.file,
    '-f',
    '--retry-open',
    '5'
  ]
  streamlinkProcess = spawn('streamlink', streamlinkArgs)

  parentPort?.postMessage({ message: `Start restreaming...` })

  const safeUrl = urlUtils.encodeUrl(streamData.originalUrl)
  const rtmpServer = `${process.env.RTMP_SERVER_URL ?? ''}${safeUrl}`
  const ffmpegArgs = [
    '-re',
    '-i',
    'pipe:0',
    '-c:v',
    'copy',
    '-c:a',
    'copy',
    '-f',
    'flv',
    rtmpServer
  ]

  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs)

  streamlinkProcess.stdout.pipe(ffmpegProcess.stdin)

  ffmpegProcess.stderr.on('data', (data) => {
    // Handle the error output, if any
    // console.error(data.toString());
  })

  ffmpegProcess.on('close', (code) => {
    let codeStr = '?'
    if (code != null) codeStr = code.toString()

    parentPort?.postMessage({
      message: `ffmpeg process exited with code ${codeStr}, shutting down process...`
    })
    parentPort?.postMessage('shutdown')
  })

  streamlinkProcess.on('close', (code) => {
    let codeStr = '?'
    if (code != null) codeStr = code.toString()

    // Move completed file to backups
    try {
      const archivedFilePath = pathToData(
        `/backups/${setArchivedFileName(streamData.originalUrl)}`
      )
      parentPort?.postMessage({
        message: `Attempting to move ${streamData.file} to backups at ${archivedFilePath}`
      })

      fs.copyFileSync(streamData.file, archivedFilePath)

      // Delete file in streams
      parentPort?.postMessage({
        message: `Deleting ${streamData.folder} in 2 minutes`
      })
      setTimeout(
        () => {
          fs.rmdirSync(streamData.folder)
          parentPort?.postMessage({ message: `Deleted ${streamData.folder}` })
        },
        1000 * 60 * 2
      ) // 2 minutes after stream ends delete the file
    } catch {
      parentPort?.postMessage({
        error: `Streamlink process exited with code ${codeStr}`
      })
    } finally {
      parentPort?.postMessage({
        message: `Streamlink process exited with code ${codeStr}, shutting down process...`
      })

      parentPort?.postMessage('shutdown')
    }
  })
}

parentPort?.on('message', (message) => {
  if (message.command === 'stream') {
    stream(message.streamData).catch((error) => {
      // Catch errors from streaming here
      console.log(error)
    })
  }

  if (message.command === 'shutdown') {
    // Clean up resources and exit gracefully
    process.exit(0)
  }
})
