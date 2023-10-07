import fs from 'node:fs'
import { getStreamInfo } from './get-info'

// Handles calling the getInfo function and returning this information to the user
// If a newStream handles starting the restream + thumbnail workers
export const setupStream = async (streamUrl: string): Promise<string> => {
  const streamInfo = await getStreamInfo(streamUrl)
  if (!streamInfo.canPlay) return ''

  // Setup the restream worker
  const restreamerWorkerUrl = new URL('./workers/restream.ts', import.meta.url)
    .href
  const restreamerWorker = new Worker(restreamerWorkerUrl, {
    smol: true
  })

  // Start the restream worker
  restreamerWorker.postMessage({
    command: 'start',
    streamInfo
  })

  restreamerWorker.addEventListener('close', (event) => {
    console.log('restreamerWorker is being closed')
  })

  const streamFile = await new Promise((resolve) => {
    restreamerWorker.onmessage = (eventMessage) => {
      console.log({ eventMessage })
      if (eventMessage.data.command === 'running') {
        const streamFile = eventMessage.data.file as string
        resolve(streamFile)
      }
    }
  })

  console.log({ streamFile })

  if (streamFile == null) return ''

  // Start the thumbnail worker
  let thumbnailLoop = 1
  const thumbnailWorkerUrl = new URL('./workers/thumbnail.ts', import.meta.url)
    .href
  const thumbnailWorker = new Worker(thumbnailWorkerUrl, {
    smol: true
  })

  thumbnailWorker.addEventListener('close', (event) => {
    console.log('thumbnailWorker is being closed')
  })

  // Get the first thumbnail
  thumbnailWorker.postMessage({
    command: 'thumbnail',
    pathToFile: streamInfo.file,
    startTime: 0
  })

  // Then loop every 2 minutes to get updated thumbnails
  const loopTime = 1000 * 60 * 2
  const thumbnailInterval = setInterval(() => {
    // If the stream file doesn't exist, stop the thumbnail worker loop
    if (!fs.existsSync(streamInfo.file)) {
      clearInterval(thumbnailInterval)
      return
    }

    const thumbnailTime = (thumbnailLoop * loopTime) / 1000 - 10

    thumbnailWorker.postMessage({
      command: 'thumbnail',
      pathToFile: streamInfo.file,
      startTime: thumbnailTime
    })

    thumbnailLoop++
  }, loopTime)

  return streamFile as string
}
