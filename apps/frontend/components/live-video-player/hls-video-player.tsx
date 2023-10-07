import React, { useRef, useEffect } from 'react'

import { Hls } from 'hls-video-element'

interface Props {
  src: string
  updateEnded: () => void
}

const HlsVideoElement: React.FC<Props> = ({ src, updateEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let video = null as unknown as HTMLVideoElement
    const hls = new Hls({ liveDurationInfinity: true })

    if (videoRef.current != null) {
      video = videoRef.current

      if (Hls.isSupported() && video instanceof HTMLMediaElement) {
        hls.loadSource(src)
        hls.attachMedia(video)
      }
    }

    return () => {
      console.log('unmounting video')
      hls.detachMedia()
      hls.destroy()

      if (video != null) {
        video.src = ''
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      autoPlay
      crossOrigin=''
      playsInline
      slot='media'
      src={src}
    />
  )
}

export default HlsVideoElement
