import { useEffect, useRef } from 'react';
import mpegts from "mpegts.js";

export const FlvVideoPlayer = ({url}: {url: string}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<mpegts.Player | null>(null);

  useEffect(() => {
    if (videoRef.current && mpegts.getFeatureList().mseLivePlayback) {
      playerRef.current = mpegts.createPlayer({
        type: 'flv',
        isLive: true,
        url,
      }, {
        liveBufferLatencyChasing: true,
      });

      playerRef.current.attachMediaElement(videoRef.current);
      playerRef.current.load();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    }
  }, [url, videoRef]);

  return (
    <video autoPlay controls ref={videoRef} />
  );
}

export default FlvVideoPlayer;