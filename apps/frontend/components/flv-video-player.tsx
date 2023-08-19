'use client'

import { useEffect, useRef } from 'react'
import type mpegts from 'mpegts.js'

export const FlvVideoPlayer = ({
  updateEnded,
  url
}: {
  updateEnded: () => void
  url: string
}): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<mpegts.Player | null>(null)

  useEffect(() => {
    const setupPlayer = async (): Promise<void> => {
      const mpegts = (await import('mpegts.js')).default

      if (
        playerRef.current == null &&
        videoRef.current != null &&
        mpegts.getFeatureList().mseLivePlayback
      ) {
        playerRef.current = mpegts.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: true,
            hasVideo: true,
            url
          },
          {
            enableWorker: false,
            enableStashBuffer: false,
            liveBufferLatencyChasing: true,
            liveBufferLatencyMaxLatency: 10,
            liveBufferLatencyMinRemain: 2,
            lazyLoad: false,
            deferLoadAfterSourceOpen: false
          }
        )

        playerRef.current.on(mpegts.Events.LOADING_COMPLETE, () => {
          updateEnded()
        })

        playerRef.current.attachMediaElement(videoRef.current)
        playerRef.current.load()
      }
    }

    void setupPlayer()

    return () => {
      if (playerRef.current != null) {
        playerRef.current.detachMediaElement()
        playerRef.current.unload()
        playerRef.current.destroy()
      }
    }
  }, [updateEnded, url])

  return <video autoPlay controls ref={videoRef} />
}

export default FlvVideoPlayer
