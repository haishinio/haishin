import { setupStream } from "@haishin/transcriber"
import transcriberHandler from "./transcriber-handler"

function isUrl(str) {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return urlRegex.test(str);
}

export default function (io, socket) {
  io.of('/').adapter.on('create-room', async (room) => {    
    if (isUrl(room)) {
      // Get the initial stream data
      const streamData = await setupStream(room);
      socket.emit('started-archiving', streamData)

      if (streamData.newStream) {
        // If it's a new stream start the transcriber after 10 seconds
        setTimeout(() => {
          transcriberHandler(io, {
            url: streamData.originalUrl,
            filename: streamData.file,
            startTime: 0,
            prompt: '',
          })
        }, 10000);
      }
    }
  });
  
  io.of('/').adapter.on('delete-room', (room) => {
    console.log({ deleteRoom: room });
  });
  
  io.of('/').adapter.on('join-room', async (room) => {
    console.log({ joinRoom: room });
    if (isUrl(room)) {
      // We just want to join in progress so let's get the streamSetup only
      const streamData = await setupStream(room);
      socket.emit('started-archiving', streamData)
    }
  });
  
  io.of('/').adapter.on('leave-room', (room) => {
    console.log({ leaveRoom: room });
  });
}
