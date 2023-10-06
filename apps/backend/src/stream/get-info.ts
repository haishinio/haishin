export const getStreamInfo = async (originalUrl: string) => {
  let canPlay = false;

  try {
    // Use streamlink to try open the stream
    canPlay = true;
  } catch (error) {
    console.log({ canPlayError: error });
  }

  // Get the streamsDirectory
  // Convert the originalUrl to it's base10 hash
  // Check if we have a stream in the streamsDirectory with the hash already

  // Build the streamUrl, fileUrl(mp4) and streamFile(m3u8)

  return {
    // Utils
    canPlay,
    newStream: true,
    // Name
    id: "",
    // Urls
    originalUrl,
    streamUrl: "",
    // Files
    folder: "",
    file: "",
    streamFile: "",
  };
};
