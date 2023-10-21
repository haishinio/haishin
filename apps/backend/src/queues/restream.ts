import fs from 'node:fs'

import {
  restreamingQueue,
  simulataneousJobs,
  thumbnailGeneratingQueue,
  transcribingQueue
} from './shared'

import { backupsFolder } from '../routes/backups'
import { getStreamInfo, type StreamInfo } from '../utils/get-stream-info'
import { setArchivedFileName } from '@haishin/utils'

restreamingQueue.process(simulataneousJobs, async (job: any) => {
  const { streamUrl } = job.data
  const streamInfo = await getStreamInfo(streamUrl)

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
    async onExit(proc, exitCode, signalCode, error): Promise<void> {
      if (error != null) console.log(error)

      // Wait 20 seconds and then kill the ffmpeg process
      await Bun.sleep(1000 * 20)
      console.log(`Closing the ffmpeg process for ${streamInfo.originalUrl}...`)
      void ffmpegProcess.stdin.end()
      ffmpegProcess.kill()

      // After another 20 seconds, move the stream file to the backup folder
      await Bun.sleep(1000 * 20)
      console.log(
        `Moving stream file for ${streamInfo.originalUrl} to backup folder...`
      )

      const backupFile = `${backupsFolder}/${setArchivedFileName(
        streamInfo.originalUrl
      )}`

      if (!fs.existsSync(backupsFolder)) {
        fs.mkdirSync(backupsFolder)
      }

      fs.renameSync(streamInfo.file, backupFile)

      // After another 20 seconds, delete the stream folder
      await Bun.sleep(1000 * 20)
      console.log(`Deleting stream folder for ${streamInfo.originalUrl}...`)
      fs.rmdirSync(streamInfo.folder, { recursive: true })
    }
  })

  // For testing stop streamlink after 5 minutes
  if (process.env.APP_ENV === 'faker') {
    setTimeout(
      () => {
        console.log(
          `Killing streamlink process for ${streamInfo.originalUrl}...`
        )
        streamLinkProcess.kill()
      },
      1000 * 60 * 5
    )
  }

  // Use ffmpeg to restream the stream
  const ffmpegArgs = [
    '-i',
    'pipe:0',
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-c:a',
    'aac',
    '-f',
    'hls',
    '-hls_time',
    2,
    '-hls_list_size',
    3,
    '-hls_flags',
    'delete_segments'
  ] as string[]

  let prodffmpegArgs = [] as string[]
  if (process.env.NODE_ENV === 'production')
    prodffmpegArgs = ['-loglevel', 'error']

  const ffmpegCmd = [
    'ffmpeg',
    ...ffmpegArgs,
    ...prodffmpegArgs,
    streamInfo.streamFile
  ]
  const ffmpegProcess = Bun.spawn(ffmpegCmd, {
    stdin: 'pipe'
  })

  // Pipe the streamlink stdout to the ffmpeg stdin
  let sentMessage = false
  for await (const chunk of streamLinkProcess.stdout) {
    ffmpegProcess.stdin.write(chunk)
    await ffmpegProcess.stdin.flush()

    if (!sentMessage && fs.existsSync(streamInfo.streamFile)) {
      // After the m3u8 file is created, send a message to the main thread to allow the streamPage to start
      job.reportProgress({ streamInfo })
      sentMessage = true
    }
  }
})

restreamingQueue.on('job progress', (job, progress) => {
  const asyncHandler = async (streamInfo: StreamInfo): Promise<void> => {
    // We can start the transcriber + thumbnail queues now
    void transcribingQueue
      .createJob({
        file: streamInfo.file,
        prompt: '',
        startTime: 0,
        viewers: 1
      })
      .setId(job)
      .save()
    void thumbnailGeneratingQueue
      .createJob({ pathToVideo: streamInfo.file, startTime: 0 })
      .setId(job)
      .save()
  }

  // Get the streamInfo from the job
  const streamInfo = progress.streamInfo as StreamInfo
  asyncHandler(streamInfo).catch((error) => {
    console.error(error)
  })
})

export default function (streamUrl: string): void {
  // Start the restreaming queue
  void restreamingQueue.createJob({ streamUrl }).setId(streamUrl).save()
}
