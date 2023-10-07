import fs from 'node:fs'

// prevents TS errors
declare const self: Worker

// Every 3 minutes or so, get the stream mp4 and generate a thumbnail
async function thumbnail(
  pathToVideo: string,
  startTime: number
): Promise<void> {
  console.log({ pathToVideo, startTime })
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
  const ffmpegProcess = Bun.spawn(ffmpegCmd)

  await ffmpegProcess.exited

  if (ffmpegProcess.exitCode === 0)
    console.log(`Generated thumbnail for ${pathToVideo}...`)

  process.exit()
}

self.onmessage = (event: MessageEvent) => {
  if (event.data.command === 'thumbnail') {
    const { pathToFile, startTime } = event.data
    thumbnail(pathToFile, startTime).catch((error) => {
      console.error(error)
    })
  }
}
