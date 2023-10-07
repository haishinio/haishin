import { getStreamInfo } from './get-info'

// Handles calling the getInfo function and returning this information to the user
// If a newStream handles starting the restream + thumbnail workers
export const setupStream = async (streamUrl: string): Promise<string> => {
  const streamInfo = await getStreamInfo(streamUrl)
  if (!streamInfo.canPlay) return ''

  // Setup the restream worker
  const restreamerWorkerUrl = new URL('./workers/restream.ts', import.meta.url)
    .href
  const restreamerWorker = new Worker(restreamerWorkerUrl)

  // Start the restream worker
  restreamerWorker.postMessage({
    command: 'start',
    streamInfo
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

  return streamFile as string
}
