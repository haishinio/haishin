import { getDuration } from '@haishin/utils'

interface SplitterResponse {
  partFileName: string
  nextStartTime: number
}

export const splitter = async (
  file: string,
  startTime = 0
): Promise<SplitterResponse> => {
  // Get the durations
  const durationOfFile = getDuration(file)

  // If the duration is null, return an empty partFileName and the startTime to try again later
  if (durationOfFile === null) {
    return {
      partFileName: '',
      nextStartTime: startTime
    }
  }

  // Get the duration of this part (time since last transcription)
  const durationOfPart = durationOfFile - startTime

  // If the duration of this part is less than 0 or 0, return an empty partFileName and the startTime to try again later
  if (durationOfPart <= 0) {
    return {
      partFileName: '',
      nextStartTime: startTime
    }
  }

  // Setup the splitter worker
  const splitterWorkerUrl = new URL('./workers/splitter.ts', import.meta.url)
    .href
  const splitterWorker = new Worker(splitterWorkerUrl, {
    smol: true
  })

  splitterWorker.addEventListener('close', (event) => {
    console.log('splitterWorker is being closed')
    splitterWorker.terminate()
  })

  // Start the splitter, and get the partFileName and duration of this part
  splitterWorker.postMessage({
    command: 'start',
    file,
    startTime,
    durationOfPart
  })

  // When the splitter worker sends a message, send this back to the transcriber
  const partFileData = (await new Promise((resolve) => {
    splitterWorker.onmessage = (eventMessage) => {
      if (eventMessage.data.command === 'complete') {
        const partFileData = eventMessage.data
        resolve({
          partFileName: partFileData.partFileName,
          nextStartTime: partFileData.nextStartTime
        })
      }
    }
  })) as SplitterResponse

  return partFileData
}

export default splitter
