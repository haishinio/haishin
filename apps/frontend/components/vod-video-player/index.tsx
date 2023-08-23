'use client'

import {
  MediaController,
  MediaControlBar,
  MediaLoadingIndicator,
  MediaVolumeRange,
  MediaMuteButton,
  MediaTimeRange,
  MediaTimeDisplay
} from 'media-chrome/dist/react'

export const LiveVideoPlayer = ({
  updateDuration,
  streamUrl
}: {
  updateDuration: (duration: number) => void
  streamUrl: string
}): React.JSX.Element => {
  return (
    <MediaController autohide='-1'>
      <video
        slot='media'
        autoPlay
        playsInline
        height='100%'
        width='100%'
        style={{ height: '100%', width: '100%' }}
        src={streamUrl}
        onLoadedMetadata={(e) => {
          updateDuration(e.currentTarget.duration)
        }}
      />
      <MediaLoadingIndicator slot='centered-chrome' />
      <MediaControlBar>
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaVolumeRange />
        <MediaMuteButton />
      </MediaControlBar>
    </MediaController>
  )
}

export default LiveVideoPlayer
