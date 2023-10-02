import fs from 'node:fs'

import { backupFolder } from '../../routes/backups'
import { setArchivedFileName } from '@haishin/utils'

// prevents TS errors
declare var self: Worker

async function restream(streamInfo: any) {
  // Create the stream folder
  console.log('Creating stream folder...')
  fs.mkdirSync(streamInfo.folder)
  console.log('Created stream folder...')

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
      if (error) console.log(error)

      // Wait 20 seconds and then kill the ffmpeg process
      setTimeout(() => {
        console.log('Closing the ffmpeg process...')
        ffmpegProcess.stdin.end()
        ffmpegProcess.kill()
      }, 20000)

      // After 40 seconds, move the stream file to the backup folder
      setTimeout(() => {
        console.log('Moving stream file to backup folder...')

        const backupFile = `${backupFolder}/${setArchivedFileName(
          streamInfo.originalUrl
        )}`

        if (!fs.existsSync(backupFolder)) {
          fs.mkdirSync(backupFolder)
        }

        console.log({ backupFile, backupFolder, streamFile: streamInfo.file })

        fs.renameSync(streamInfo.file, backupFile)
      }, 40000)

      // After 60 seconds, delete the stream folder
      setTimeout(() => {
        console.log('Deleting stream folder...')
        fs.rmdirSync(streamInfo.folder, { recursive: true })
      }, 60000)
    }
  })

  // For testing stop streamlink after 10 seconds
  setTimeout(() => {
    console.log('Killing streamlink process...')
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
    'event',
    streamInfo.streamFile
  ]
  const ffmpegProcess = Bun.spawn(['ffmpeg', ...ffmpegArgs], {
    stdin: 'pipe'
  })

  // Pipe the streamlink stdout to the ffmpeg stdin
  for await (const chunk of streamLinkProcess.stdout) {
    ffmpegProcess.stdin.write(chunk)
    ffmpegProcess.stdin.flush()
  }
}

self.onmessage = (event: MessageEvent) => {
  if (event.data.command === 'start') {
    restream(event.data.streamInfo)
  }
}
