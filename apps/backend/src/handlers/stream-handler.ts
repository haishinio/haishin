import { setupStream } from "@haishin/transcriber"
import transcriberHandler from "./transcriber-handler"

function isUrl(str) {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return urlRegex.test(str);
}

export default function (io) {  
  io.of('/').adapter.on('delete-room', (room) => {
    console.log({ deleteRoom: room });
  });
  
  io.of('/').adapter.on('join-room', async (room, userId) => {
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
    }
  });
  
  io.of('/').adapter.on('leave-room', (room) => {
    console.log({ leaveRoom: room });
  });
}
