import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import registerStreamHandlers from "./handlers/stream-handler";

const app = express();
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
});

httpServer.listen(8080);