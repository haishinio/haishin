import { setupStream } from "@haishin/transcriber"
import transcriberHandler from "./transcriber-handler"

import type { Server } from "socket.io";

function isUrl(str: string) {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return urlRegex.test(str);
}

export default function (io: Server) {  
  io.of('/').adapter.on('delete-room', (room: string) => {
    console.log({ deleteRoom: room });
  });
  
  io.of('/').adapter.on('join-room', async (room: string, userId: string) => {
    if (isUrl(room)) {
      const streamData = await setupStream(room);

      // Should check if live too, return user back to homepage?
      if (!streamData.canPlay) {
        io.to(userId).emit('stream-error', streamData);
      } else {
        io.to(userId).emit('start-transcribing', streamData);
      }

      if (streamData.canPlay && streamData.newStream) {
        transcriberHandler(io, {
          url: streamData.originalUrl,
          filename: streamData.file,
          startTime: 0,
          prompt: '',
        })
      }
    } else {
      io.to(userId).emit('stream-error', { message: 'Invalid URL' });
    }
  });
  
  io.of('/').adapter.on('leave-room', (room: string) => {
    console.log({ leaveRoom: room });
  });
}
