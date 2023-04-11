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
});

io.on("connection", (socket) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
  } else {
    // new or unrecoverable session
    registerStreamHandlers(io, socket);
  
    const {streamUrl} = socket.handshake.query;
    console.log({ streamUrl });
  
    if (streamUrl) {
      socket.join(streamUrl);
    }
  }

  socket.on("join-room", ({room}) => {
    socket.join(room);
  });

  socket.on("leave-room", ({room}) => {
    socket.leave(room);
  });
});

console.log("Websocket Server listening on port 8080");
httpServer.listen(8080);