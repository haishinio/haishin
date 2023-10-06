import { Elysia } from 'elysia'
import { createClient } from 'redis'
import { getStreamInfo } from './stream/get-info'

const redisClient = await createClient({
  url: process.env.REDIS_URL
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()

const app = new Elysia()
  .ws('/', {
    open(ws) {
      const { streamUrl } = ws.data.query

      if (typeof streamUrl === 'string' && !ws.isSubscribed(streamUrl)) {
        async function joinChannel(streamUrl: string) {
          // Subscribe to the stream room
          ws.subscribe(streamUrl);

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

            if (currentUsers === 1) {
              // Start the stream
              console.log(
                `First user has joined the room ${streamUrl}, start restreaming...`
              )
            }
          } else {
            console.log(
              'User already in the room, stream already being transcribed...',
              streamUrl,
              ws.remoteAddress
            )

            // Get the stream info
            const streamInfo = await getStreamInfo(streamUrl)
            ws.send(streamInfo)
          }
        }

        joinChannel(streamUrl)
      } else {
        ws.close()
      }
    },
    message(ws, message) {
      // if (message === "join-stream-transcription") {
      //   const { streamUrl } = ws.data.query;
      //   if (typeof streamUrl === "string" && !ws.isSubscribed(streamUrl)) {
      //     ws.subscribe(streamUrl);
      //   }
      // }
      // if (message === "leave-stream-transcription") {
      //   const { streamUrl } = ws.data.query;
      //   if (typeof streamUrl === "string" && ws.isSubscribed(streamUrl)) {
      //     ws.unsubscribe(streamUrl);
      //   }
      // }
    },
    close(ws) {
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
  `HaishinWS is running at ${app.server?.hostname}:${app.server?.port}`
)
