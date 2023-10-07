import fs from 'node:fs'

import { backupFolder } from '../../routes/backups'
import { setArchivedFileName } from '@haishin/utils'

import type { StreamInfo } from '../get-info'

// prevents TS errors
declare const self: Worker

async function restream(streamInfo: StreamInfo): Promise<void> {
  // Create the stream folder
  console.log(`Creating stream folder for ${streamInfo.originalUrl}...`)
  fs.mkdirSync(streamInfo.folder)
  console.log(`Created stream folder for ${streamInfo.originalUrl}...`)

  // Use streamlink to download the stream
  const streamLinkArgs = [
    streamInfo.originalUrl,
    '--default-stream',
    'best',
    '-R',
    streamInfo.file,
    '-f',
    '--retry-open',
    '5'
  ]
  const streamLinkProcess = Bun.spawn(['streamlink', ...streamLinkArgs], {
    onExit(proc, exitCode, signalCode, error) {
      if (error != null) console.log(error)

      // Wait 20 seconds and then kill the ffmpeg process
      setTimeout(() => {
        console.log(
          `Closing the ffmpeg process for ${streamInfo.originalUrl}...`
        )
        void ffmpegProcess.stdin.end()
        ffmpegProcess.kill()
      }, 20000)

      // After 40 seconds, move the stream file to the backup folder
      setTimeout(() => {
        console.log(
          `Moving stream file for ${streamInfo.originalUrl} to backup folder...`
        )

        const backupFile = `${backupFolder}/${setArchivedFileName(
          streamInfo.originalUrl
        )}`

        if (!fs.existsSync(backupFolder)) {
          fs.mkdirSync(backupFolder)
        }

        fs.renameSync(streamInfo.file, backupFile)
      }, 40000)

      // After 60 seconds, delete the stream folder
      setTimeout(() => {
        console.log(`Deleting stream folder for ${streamInfo.originalUrl}...`)
        fs.rmdirSync(streamInfo.folder, { recursive: true })
      }, 60000)
    }
  })

  // For testing stop streamlink after 10 seconds
  setTimeout(() => {
    console.log(`Killing streamlink process for ${streamInfo.originalUrl}...`)
    streamLinkProcess.kill()
  }, 60000)

  // Use ffmpeg to restream the stream
  const ffmpegArgs = [
    '-i',
    'pipe:0',
    '-c:v',
    'copy',
    '-c:a',
    'copy',
    '-f',
    'hls',
    '-map',
    '0:a?',
    '-map',
    '0:v?',
    '-hls_time',
    '2',
    '-hls_list_size',
    '3',
    '-hls_flags',
    'delete_segments',
    '-hls_playlist_type',
    'event'
  ]

  let prodffmpegArgs = [] as string[]
  if (process.env.NODE_ENV === 'production')
    prodffmpegArgs = ['-loglevel', 'error']

  const ffmpegProcess = Bun.spawn(
    ['ffmpeg', ...ffmpegArgs, ...prodffmpegArgs, streamInfo.streamFile],
    {
      stdin: 'pipe'
    }
  )

  // Pipe the streamlink stdout to the ffmpeg stdin
  let sentMessage = false
  for await (const chunk of streamLinkProcess.stdout) {
    ffmpegProcess.stdin.write(chunk)
    await ffmpegProcess.stdin.flush()

    if (!sentMessage && fs.existsSync(streamInfo.streamFile)) {
      // After the m3u8 file is created, send a message to the main thread to allow the streamPage to start
      self.postMessage({
        command: 'running',
        file: streamInfo.file
      })
      sentMessage = true
    }
  }
}

self.onmessage = (event: MessageEvent) => {
  if (event.data.command === 'start') {
    restream(event.data.streamInfo).catch((error) => {
      console.error(error)
    })
  }
}
