import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { splitVideoFile, transcribeTranslatePart } from '@haishin/transcriber'

import type { Server } from 'socket.io'

interface TranscriberData {
  url: string
  filename: string
  startTime: number
  prompt: string
}

const transcriberHandler = async function (
  io: Server,
  data: TranscriberData
): Promise<void> {
  try {
    const { url, filename, startTime, prompt } = data
    const connectedClients = io.sockets.adapter.rooms.get(url)?.size

    if (connectedClients != null && connectedClients > 0) {
      // If the startTime is 0, wait for the file to exist
      if (startTime === 0) {
        while (!fs.existsSync(filename)) {
          // Do nothing, wait for file to exist
        }
      }

      const { partFileName, nextStartTime } = await splitVideoFile(
        filename,
        startTime
      )

      if (partFileName !== '') {
        const { transcription, translation } = await transcribeTranslatePart(
          partFileName,
          prompt
        )

        io.to(url).emit('transcription-translation', {
          id: uuidv4(),
          startTime,
          transcription,
          translation
        })

        try {
          fs.unlinkSync(partFileName)
        } catch (error) {
          console.log('Could not delete part file', partFileName)
        }

        void transcriberHandler(io, {
          url,
          filename,
          startTime: nextStartTime,
          prompt: transcription
        })
      } else {
        if (fs.existsSync(filename)) {
          // Just try again
          console.log('No filepart so try again')
          void transcriberHandler(io, {
            url,
            filename,
            startTime: nextStartTime,
            prompt
          })
        } else {
          // No file and no part so we're done
        }
      }
    } else {
      // console.log(`No connected clients for ${url}, skipping transcription and translation`);

      // If we have a file then try again in 5 seconds
      if (fs.existsSync(filename)) {
        setTimeout(() => {
          void transcriberHandler(io, {
            url,
            filename,
            startTime: startTime + 5,
            prompt: ''
          })
        }, 5000)
      }
    }
  } catch (error) {
    // Transcriber Error
    console.log('Transcriber Error', error)
  }
}

export default transcriberHandler
