import fs from 'fs'
import exec from 'await-exec'
import { Streamlink } from '@dragongoose/streamlink'
import { format } from 'date-fns'
import transcriberHandler from "./transcriber-handler"

interface StreamData {
  file: string
  newStream: boolean
  originalUrl: string
  streamUrl: string
}

function getPathsByUrl(url: string) {
  const paths = url
    .replace('http://', '')
    .replace('https://', '')
    .replace('c:', '')
    .split('/')
  const site = paths.shift()
  
  return {
    site, 
    user: paths.join('-')
  }
}

function isUrl(str) {
  // Regular expression for URLs
  const urlRegex = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
  return urlRegex.test(str);
}

function setFileName(url: string): string {
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}.mp4`;
  return path;
}

function setArchivedFileName(url: string): string {
  const dateTimeStart = format(new Date(), 'y-MM-dd_HH-mm-ss');
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}--${dateTimeStart}.mp4`;
  return path;
}

async function setupStream (originalUrl: string): Promise<StreamData> {
  const file = `./data/streams/${setFileName(originalUrl)}`;

  let {stdout: streamUrl} = await exec(`streamlink "${originalUrl}" best --stream-url`);
  streamUrl = streamUrl.replace('\r\n', '');

  try {
    fs.accessSync(file, fs.constants.R_OK)
    // If it exists then return the output
    return {
      newStream: false,
      file,
      originalUrl,
      streamUrl,
    };
    // DO SOMETHING
  } catch {
    const client = new Streamlink(originalUrl, { outputStdout: true })
    const streamFile = fs.createWriteStream(file)

    client.begin()
    client.on('log', data => {
      // console.log('writing to file')
      streamFile.write(data) // puts data into file
    })

    client.on('error', (error: Error) => {
      console.log(error)
    })
  
    client.on('close', () => {
      streamFile.close() // closes the file when the stream ends or is closed
  
      // Move completed file to backups
      fs.copyFileSync(file, `./data/backups/${setArchivedFileName(originalUrl)}`)

      // Delete file in streams
      fs.unlinkSync(file)
    })

    return {
      newStream: true,
      file,
      originalUrl,
      streamUrl,
    };
  }
}

export default function (io, socket) {
  io.of('/').adapter.on('create-room', async (room) => {
    console.log({ createRoom: room });
    
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
