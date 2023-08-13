'use client'

import { useEffect, useRef } from 'react'
import type mpegts from 'mpegts.js'

export const FlvVideoPlayer = ({ url }: { url: string }): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<mpegts.Player | null>(null)

  useEffect(() => {
    const setupPlayer = async (): Promise<void> => {
      const mpegts = (await import('mpegts.js')).default

      if (videoRef.current != null && mpegts.getFeatureList().mseLivePlayback) {
        playerRef.current = mpegts.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: true,
            hasVideo: true,
            url
          },
          {
            enableWorker: true,
            enableStashBuffer: false,
            liveBufferLatencyChasing: true,
            liveBufferLatencyMaxLatency: 10,
            liveBufferLatencyMinRemain: 2,
            lazyLoad: false,
            deferLoadAfterSourceOpen: false
          }
        )

        playerRef.current.attachMediaElement(videoRef.current)
        playerRef.current.load()
      }
    }

    void setupPlayer()

    return () => {
      if (playerRef.current != null) {
        playerRef.current.destroy()
      }
    }
  }, [url, videoRef])

  return <video autoPlay controls ref={videoRef} />
}

export default FlvVideoPlayer
