import { parentPort } from 'worker_threads'
import { spawn } from 'child_process'

async function thumbnail(
  pathToVideo: string,
  startTime: number
): Promise<void> {
  console.log('Getting latest thumbnail', pathToVideo, startTime)

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
    pathToVideo.replace('.mp4', '.jpg')
  ]

  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs)

  ffmpegProcess.on('close', (code) => {
    let codeStr = '?'
    if (code != null) codeStr = code.toString()

    parentPort?.postMessage({
      message: `ffmpeg process exited with code ${codeStr}, shutting down process...`
    })
    parentPort?.postMessage('shutdown')
  })
}

parentPort?.on('message', (message) => {
  if (message.command === 'thumbnail') {
    thumbnail(message.pathToFile, message.startTime).catch((error) => {
      // Log errors
      console.log(error)
    })
  }

  if (message.command === 'shutdown') {
    // Clean up resources and exit gracefully
    process.exit(0)
  }
})
