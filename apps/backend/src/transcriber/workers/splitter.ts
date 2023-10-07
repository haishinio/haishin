// Handles splitting the video into an audio chunk for use to send to openAI + deepL
import fs from 'node:fs'
import path from 'node:path'

declare const self: Worker

const streamPartFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'stream-parts'
)

async function splitterWorker(
  streamFile: string,
  startTime = 0,
  durationOfPart = 0
): Promise<void> {
  // Setup the partFileName
  if (!fs.existsSync(streamPartFolder)) {
    fs.mkdirSync(streamPartFolder)
  }
  const partFileName = path.join(streamPartFolder, `${crypto.randomUUID()}.wav`)

  // Use ffmpeg to split the stream
  const ffmpegArgs = [
    '-i',
    'pipe:0',
    '-ss',
    startTime.toString(),
    '-t',
    durationOfPart.toString(),
    '-acodec',
    'pcm_s16le',
    '-ar',
    '44100',
    '-ac',
    '1',
    '-hide_banner',
    '-loglevel',
    'error',
    partFileName
  ]

  const ffmpegProcess = Bun.spawn(['ffmpeg', ...ffmpegArgs], {
    stdin: Bun.file(streamFile)
  })

  await ffmpegProcess.exited

  // Send the partFileName back to the transcriber
  self.postMessage({
    command: 'complete',
    partFileName,
    nextStartTime: startTime + durationOfPart
  })
}

self.onmessage = (event: MessageEvent) => {
  if (event.data.command === 'start') {
    splitterWorker(
      event.data.file,
      event.data.startTime,
      event.data.durationOfPart
    ).catch((error) => {
      console.error(error)
    })
  }
}
