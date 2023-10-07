import { Elysia } from 'elysia'
import { createClient } from 'redis'
import { cors } from '@elysiajs/cors'

import backups from './routes/backups'
import streams from './routes/streams'

import { setupStream } from './stream'
import { getStreamInfo } from './stream/get-info'
import { transcribeStream } from './transcriber'

const redisClient = await createClient({
  url: process.env.REDIS_URL
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()

async function joinChannel(server: any, ws: any, streamUrl: string) {
  // Get the stream info
  const streamInfo = await getStreamInfo(streamUrl)

  if (!streamInfo.canPlay) {
    ws.send({ error: 'Stream is not available' })
    ws.close()
    return
  }

  // Subscribe to the stream room
  ws.subscribe(streamUrl)

  // Check user is already in the redis set
  const isUserInRoom = await redisClient.sIsMember(
    `users:${streamUrl}`,
    ws.remoteAddress
  )

  if (!isUserInRoom) {
    // Add user to the redis set
    redisClient.sAdd(`users:${streamUrl}`, ws.remoteAddress)
    console.log('User joined the room', streamUrl, ws.remoteAddress)

    // Check if this is the first user in the room
    const currentUsers = await redisClient.sCard(`users:${streamUrl}`)

    if (currentUsers === 1 && streamInfo.newStream) {
      // Start the stream
      console.log(
        `First user has joined the room ${streamUrl} and stream is new, start restreaming...`
      )

      // Setup the stream
      const streamFile = await setupStream(streamUrl)

      // Using streamInfo, start to split the video file for transcribing
      transcribeStream(server, redisClient, streamUrl, streamFile)
    }
  } else {
    console.log(
      'User already in the room, stream already being transcribed...',
      streamUrl,
      ws.remoteAddress
    )
  }

  // Send the streamInfo to the user for ui setup
  ws.send({ type: 'start-transcribing', content: streamInfo })
}

const app = new Elysia()
  .use(cors())
  .use(backups)
  .use(streams)
  .ws('/', {
    open(ws) {
      const { streamUrl } = ws.data.query

      if (typeof streamUrl === 'string' && !ws.isSubscribed(streamUrl)) {
        joinChannel(app.server, ws, streamUrl)
      } else {
        ws.close()
      }
    },
    message(ws, message) {
      if (message === 'join-stream-transcription') {
        const { streamUrl } = ws.data.query
        if (typeof streamUrl === 'string' && !ws.isSubscribed(streamUrl)) {
          joinChannel(app.server, ws, streamUrl)
        }
      }

      if (message === 'leave-stream-transcription') {
        const { streamUrl } = ws.data.query
        if (typeof streamUrl === 'string' && ws.isSubscribed(streamUrl)) {
          ws.unsubscribe(streamUrl)
        }
      }
    },
    close(ws) {
      if (!ws.remoteAddress) return

      const { streamUrl } = ws.data.query
      redisClient.sRem(`users:${streamUrl}`, ws.remoteAddress)

      console.log('User left the room', ws.remoteAddress, streamUrl)
    }
  })
  .listen({
    hostname: '0.0.0.0',
    port: process.env.PORT || 8080
  })

console.log(
  `Haishin Api is running at ${app.server?.hostname}:${app.server?.port}`
)
