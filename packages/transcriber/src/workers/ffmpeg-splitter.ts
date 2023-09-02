import { parentPort } from 'worker_threads'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: false, corePath: '@ffmpeg/core' })

async function run(
  pathToFile: string,
  startTime: number,
  durationOfPart: number
): Promise<void> {
  await ffmpeg.load()

  try {
    const input = await fetchFile(pathToFile)
    ffmpeg.FS('writeFile', 'input.mp4', input)

    await ffmpeg.run(
      '-i',
      'input.mp4',
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
      'output.wav'
    )

    const outputData = ffmpeg.FS('readFile', 'output.wav')

    parentPort?.postMessage({ output: outputData })
  } catch (error: unknown) {
    const { message } = error as Error
    parentPort?.postMessage({ error: message })
  } finally {
    ffmpeg.FS('unlink', 'input.mp4')
    ffmpeg.FS('unlink', 'output.wav')

    ffmpeg.exit()
    parentPort?.close()
    process.exit(0)
  }
}

parentPort?.on('message', (message) => {
  if (message.command === 'run') {
    run(message.pathToFile, message.startTime, message.durationOfPart).catch(
      (error) => {
        // Log errors
        console.log(error)
      }
    )
  }

  if (message.command === 'shutdown') {
    // Clean up resources and exit gracefully
    process.exit(0)
  }
})
