import express from "express";
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

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      process.env.PRODUCTION_URL ?? '',
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
      socket.emit('start-transcribing');
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