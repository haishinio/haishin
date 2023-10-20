import fs from 'node:fs'
import { simulataneousJobs, thumbnailGeneratingQueue } from './shared'

interface ThumbnailGeneratingData {
  pathToVideo: string
  startTime: number
}

const loopTime = 1000 * 60 * 2 // 2 minutes

thumbnailGeneratingQueue.process(simulataneousJobs, async (job: any) => {
  const { pathToVideo, startTime } = job.data as ThumbnailGeneratingData

  if (!fs.existsSync(pathToVideo)) return

  const ffmpegArgs = [
    '-ss',
    startTime.toString(),
    '-noaccurate_seek',
    '-i',
    pathToVideo,
    '-vframes',
    '1',
    '-q:v',
    '2',
    '-y',
    '-loglevel',
    'error',
    pathToVideo.replace('.mp4', '.jpg')
  ]

  const ffmpegCmd = ['ffmpeg', ...ffmpegArgs]
  const ffmpegThumbnailProcess = Bun.spawn(ffmpegCmd)

  await ffmpegThumbnailProcess.exited

  if (ffmpegThumbnailProcess.exitCode === 0) {
    console.log(`Generated thumbnail for ${pathToVideo}...`)
  }

  const nextStartTime = startTime + loopTime - 10

  return { pathToVideo, startTime: nextStartTime }
})

thumbnailGeneratingQueue.on(
  'job succeeded',
  async (job: string, result: ThumbnailGeneratingData) => {
    // Run again in 2 minutes
    await Bun.sleep(loopTime)
    // Check stream file still exists
    if (fs.existsSync(result.pathToVideo)) {
      void thumbnailGeneratingQueue
        .createJob({
          pathToVideo: result.pathToVideo,
          startTime: result.startTime
        })
        .setId(job)
        .save()
    }
  }
)
