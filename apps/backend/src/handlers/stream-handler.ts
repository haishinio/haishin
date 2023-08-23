import fs from 'fs'

import { setupStream } from '@haishin/transcriber'
import transcriberHandler from './transcriber-handler'

import type { Server } from 'socket.io'

function isUrl(str: string): boolean {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
  return urlRegex.test(str)
}

async function joinRoomSetup(
  io: Server,
  room: string,
  userId: string
): Promise<void> {
  const streamData = await setupStream(room)

  // Should check if live too, return user back to homepage?
  if (!streamData.canPlay) {
    io.to(userId).emit('stream-error', streamData)
  } else {
    // Wait for the streamFile to be available before allowing transcriptions to start
    // while (!fs.existsSync(streamData.file)) {
    while (
      !fs.existsSync(streamData.file) ||
      fs.statSync(streamData.file).size === 0
    ) {
      // Do nothing
      // console.log("Stream isn't ready")
    }

    console.log('Stream is ready')
    io.to(userId).emit('start-transcribing', streamData)

    if (streamData.newStream) {
      void transcriberHandler(io, {
        url: streamData.originalUrl,
        filename: streamData.file,
        startTime: 0,
        prompt: ''
      })
    }
  }
}

export default function (io: Server): void {
  io.of('/').adapter.on('delete-room', (room: string) => {
    console.log({ deleteRoom: room })
  })

  io.of('/').adapter.on('join-room', (room: string, userId: string) => {
    if (isUrl(room)) {
      void joinRoomSetup(io, room, userId)
    } else if (room === userId) {
      // In this case we don't want to do anything
    } else {
      console.log({ invalidUrl: room })
      io.to(userId).emit('stream-error', { message: 'Invalid URL' })
    }
  })

  io.of('/').adapter.on('leave-room', (room: string) => {
    console.log({ leaveRoom: room })
  })
}
