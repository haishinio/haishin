import express from 'express'
import NodeMediaServer from 'node-media-server'
import { createServer } from 'http'
import { Server } from 'socket.io'
import * as Sentry from '@sentry/node'

import registerStreamHandlers from './handlers/stream-handler'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  })
}

process.chdir('../../')

const app = express()

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

const httpServer = createServer(app)

let productionMediaServerHttps = {}
let productionCors = [] as string[]

if (
  process.env.PRODUCTION_URL !== undefined &&
  process.env.PRODUCTION_URL !== '' &&
  !process.env.PRODUCTION_URL.includes('http://localhost')
) {
  const productionDomain = process.env.PRODUCTION_URL.replace('https://', '')

  productionMediaServerHttps = {
    https: {
      port: 8443,
      key: `/etc/letsencrypt/live/${productionDomain}/privkey.pem`,
      cert: `/etc/letsencrypt/live/${productionDomain}/fullchain.pem`
    }
  }

  productionCors = [`http://${productionDomain}`, `https://${productionDomain}`]
}

// Set up the NodeMediaServer
const config = {
  logType: 3,

  rtmp: {
    port: 1935,
    chunk_size: 4096,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './data'
  },
  ...productionMediaServerHttps
}

const nms = new NodeMediaServer(config)

// Event handler for the 'prePublish' event
nms.on('prePublish', (id, StreamPath, args) => {
  // Handle the pre-publish event, e.g., start streaming to the RTMP endpoint
  console.log('A new stream is about to be published:', StreamPath)
})

// Event handler for the 'donePublish' event
nms.on('donePublish', (id, StreamPath, args) => {
  // Handle the done-publish event, e.g., stop streaming to the RTMP endpoint
  console.log('A stream has been unpublished:', StreamPath)
})

// Attach the NodeMediaServer to the Express.js server
nms.run()

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:8080',
      ...productionCors
    ]
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true
  }
})

// Register handlers
registerStreamHandlers(io)

io.on('connection', async (socket) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
  } else {
    // new or unrecoverable session
    const { streamUrl } = socket.handshake.query
    if (typeof streamUrl === 'string') {
      await socket.join(streamUrl)
      // socket.emit('start-transcribing');
    }
  }

  socket.on('join-stream-transcription', async ({ room }) => {
    await socket.join(room)
  })

  socket.on('leave-stream-transcription', async ({ room }) => {
    await socket.leave(room)
  })
})

console.log('Websocket Server listening on port 8080')
httpServer.listen(8080)
