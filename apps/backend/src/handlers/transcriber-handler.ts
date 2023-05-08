import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

import { splitVideoFile, transcribeTranslatePart } from '@haishin/transcriber'

interface TranscriberData {
  url: string
  filename: string
  startTime: number
  prompt: string
}

const transcriberHandler = async function (io, data: TranscriberData) {
  const { url, filename, startTime, prompt } = data
  const connectedClients = io.sockets.adapter.rooms.get(url)?.size;

  if (connectedClients) {
    const { partFileName, nextStartTime } = await splitVideoFile(filename, startTime)

    if (partFileName !== '') {
      const { transcription, translation } = await transcribeTranslatePart(partFileName, prompt)

      io.to(url).emit('transcription-translation', {
        id: uuidv4(),
        startTime,
        transcription,
        translation,
      })

      fs.unlinkSync(partFileName)

      transcriberHandler(io, {
        url, filename, startTime: nextStartTime, prompt: transcription
      })
    } else {
      // Just try again
      console.log('No filepart so try again')
      transcriberHandler(io, {
        url, filename, startTime: nextStartTime, prompt
      })
    }
  } else {
    console.log(`No connected clients for ${url}, skipping transcription and translation`)
    setTimeout(() => {
      transcriberHandler(io, {
        url, filename, startTime: startTime + 5, prompt: ''
      })
    }, 5000)
  }
}

export default transcriberHandler;

