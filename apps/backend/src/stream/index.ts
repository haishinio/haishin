import { getStreamInfo } from "./get-info";

// Handles calling the getInfo function and returning this information to the user
// If a newStream handles starting the restream + thumbnail workers
export const setupStream = async (streamUrl: string) => {
  const streamInfo = await getStreamInfo(streamUrl);
  if (!streamInfo.canPlay) return streamInfo;

  // Start the restreamer
  const restreamerWorkerUrl = new URL("./workers/restream.ts", import.meta.url)
    .href;
  const restreamerWorker = new Worker(restreamerWorkerUrl);

  restreamerWorker.postMessage({
    command: "start",
    streamInfo,
  });

  return streamInfo;
};
