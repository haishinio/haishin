import Elysia from "elysia";
import { createClient } from "redis";

import { setupStream } from "../stream";
import { getStreamInfo } from "../stream/get-info";

const redisClient = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const ws = new Elysia().ws("/", {
  open(ws) {
    const { streamUrl } = ws.data.query;

    if (typeof streamUrl === "string" && !ws.isSubscribed(streamUrl)) {
      async function joinChannel(streamUrl: string) {
        // Get the stream info
        const streamInfo = await getStreamInfo(streamUrl);

        if (!streamInfo.canPlay) {
          ws.send({ error: "Stream is not available" });
          ws.close();
          return;
        }

        // Subscribe to the stream room
        ws.subscribe(streamUrl);

        // Check user is already in the redis set
        const isUserInRoom = await redisClient.sIsMember(
          `users:${streamUrl}`,
          ws.remoteAddress
        );

        if (!isUserInRoom) {
          // Add user to the redis set
          redisClient.sAdd(`users:${streamUrl}`, ws.remoteAddress);
          console.log("User joined the room", streamUrl, ws.remoteAddress);

          // Check if this is the first user in the room
          const currentUsers = await redisClient.sCard(`users:${streamUrl}`);

          if (currentUsers === 1 && streamInfo.newStream) {
            // Start the stream
            console.log(
              `First user has joined the room ${streamUrl} and stream is new, start restreaming...`
            );

            setupStream(streamUrl);
          }
        } else {
          console.log(
            "User already in the room, stream already being transcribed...",
            streamUrl,
            ws.remoteAddress
          );
        }

        // Send the streamInfo to the user for ui setup
        ws.send(streamInfo);
      }

      joinChannel(streamUrl);
    } else {
      ws.close();
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
    if (!ws.remoteAddress) return;

    const { streamUrl } = ws.data.query;
    redisClient.sRem(`users:${streamUrl}`, ws.remoteAddress);

    console.log("User left the room", ws.remoteAddress, streamUrl);
  },
});

export default ws;
