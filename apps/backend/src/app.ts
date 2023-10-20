import fs from 'node:fs'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'

import { redisClient } from './plugins/setup'

import backups from './routes/backups'
import streams, { streamsFolder } from './routes/streams'
import reset from './routes/reset'

import { getStreamInfo } from './utils/get-stream-info'

import { transcribingQueue } from './queues/shared'
import restream from './queues/restream'
import './queues/thumbnail'
import './queues/transcribe'

import type { TranscriptionResponse } from './queues/transcribe'

async function joinChannel(ws: any, streamUrl: string): Promise<void> {
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
    await redisClient.sAdd(`users:${streamUrl}`, ws.remoteAddress)
    console.log('User joined the room', streamUrl, ws.remoteAddress)

    // Start the restreaming and transcriptions
    restream(streamUrl)
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
  .use(
    staticPlugin({
      assets: streamsFolder,
      prefix: '/streams',
      ignorePatterns: ['.gitkeep']
    })
  )
  .use(reset)
  .ws('/', {
    async open(ws) {
      const { streamUrl } = ws.data.query

      if (typeof streamUrl === 'string' && !ws.isSubscribed(streamUrl)) {
        await joinChannel(ws, streamUrl)
      } else {
        ws.close()
      }
    },
    async message(ws, message) {
      if (message === 'join-stream-transcription') {
        const { streamUrl } = ws.data.query
        if (typeof streamUrl === 'string' && !ws.isSubscribed(streamUrl)) {
          await joinChannel(ws, streamUrl)
        }
      }

      if (message === 'leave-stream-transcription') {
        const { streamUrl } = ws.data.query
        if (typeof streamUrl === 'string' && ws.isSubscribed(streamUrl)) {
          ws.unsubscribe(streamUrl)
        }
      }
    },
    async close(ws) {
      if (ws.remoteAddress === null) return

      const { streamUrl } = ws.data.query
      await redisClient.sRem(`users:${streamUrl}`, ws.remoteAddress)

      console.log('User left the room', ws.remoteAddress, streamUrl)
    }
  })
  .listen({
    hostname: '0.0.0.0',
    port: process.env.PORT ?? 8080
  })

transcribingQueue.on(
  'job succeeded',
  async (job: string, result: TranscriptionResponse) => {
    // Send the results to the client
    if (result.socketData !== undefined)
      app.server?.publish(job, JSON.stringify(result.socketData))

    // Restart the transcriber queue unless the stream is over
    if (fs.existsSync(result._file)) {
      transcribingQueue
        .createJob({
          file: result._file,
          prompt: result._prompt,
          startTime: result._startTime,
          viewers: await redisClient.sCard(`users:${job}`)
        })
        .setId(job)
        .save()
    }
  }
)

console.log(
  `Haishin Api is running at ${app.server?.hostname}:${app.server?.port}`
)
