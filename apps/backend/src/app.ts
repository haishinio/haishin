import express from "express";
import NodeMediaServer from "node-media-server";
import { createServer } from "http";
import { Server } from "socket.io";
import * as Sentry from "@sentry/node";

import registerStreamHandlers from "./handlers/stream-handler";

Sentry.init({ dsn: process.env.SENTRY_DSN });

process.chdir('../../');

const app = express();

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

const httpServer = createServer(app);

let productionMediaServerHttps = {};
let productionCors = [];

if (process.env.PRODUCTION_URL) {
  const productionDomain = process.env.PRODUCTION_URL.replace('https://', '')

  productionMediaServerHttps = {
    https: {
      port: 8443,
      key: `/etc/letsencrypt/live/${productionDomain}/privkey.pem`,
      cert: `/etc/letsencrypt/live/${productionDomain}/fullchain.pem`,
    }
  }

  productionCors = [
    `http://${productionDomain}`,
    `https://${productionDomain}`,
  ]
}

// Set up the NodeMediaServer
const config = {
  logType: 3,

  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  ...productionMediaServerHttps
};

const nms = new NodeMediaServer(config);

// Event handler for the 'prePublish' event
nms.on('prePublish', (id, StreamPath, args) => {
  // Handle the pre-publish event, e.g., start streaming to the RTMP endpoint
  console.log('A new stream is about to be published:', StreamPath);
});

// Event handler for the 'donePublish' event
nms.on('donePublish', (id, StreamPath, args) => {
  // Handle the done-publish event, e.g., stop streaming to the RTMP endpoint
  console.log('A stream has been unpublished:', StreamPath);
});

// Attach the NodeMediaServer to the Express.js server
nms.run({ httpServer });

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:8080",
      ...productionCors,
    ],
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
});

// Register handlers
registerStreamHandlers(io);

io.on("connection", async (socket) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
  } else {
    // new or unrecoverable session  
    const {streamUrl} = socket.handshake.query;  
    if (streamUrl) {
      socket.join(streamUrl);
      // socket.emit('start-transcribing');
    }
  }

  socket.on("join-stream-transcription", async ({room}) => {
    socket.join(room);
  });

  socket.on("leave-stream-transcription", ({room}) => {
    socket.leave(room);
  });
});

console.log("Websocket Server listening on port 8080");
httpServer.listen(8080);