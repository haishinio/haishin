'use client'

import { useState } from 'react'
import useStream from '../../hooks/useStream'

import {
  MediaController,
  MediaControlBar,
  MediaLoadingIndicator,
  MediaVolumeRange,
  MediaLiveButton,
  MediaMuteButton
} from 'media-chrome/dist/react'
import HlsVideoElement from './hls-video-player'
import Duration from './duration'
import Loading from '../loading'

import type StreamInfo from '../../types/StreamInfo'

export const LiveVideoPlayer = ({
  streamId,
  updateEnded,
  url
}: {
  streamId?: string
  updateEnded: () => void
  url: string
}): React.JSX.Element => {
  const [hasEnded, setHasEnded] = useState(false)
  const { data, isLoading } = useStream(streamId)

  if (isLoading || data === undefined) return <Loading />

  const { duration, started } = data as StreamInfo

  const updateHasEnded = (): void => {
    setHasEnded(true)
    updateEnded()
  }

  return (
    <MediaController autohide='-1' defaultstreamtype='live'>
      {started !== null && (
        <HlsVideoElement updateEnded={updateHasEnded} src={url} />
      )}
      <MediaLoadingIndicator slot='centered-chrome' />
      {started === null && (
        <MediaLoadingIndicator
          slot='centered-chrome'
          className='always-loading'
        />
      )}
      <MediaControlBar>
        <MediaLiveButton />
        {started !== null && (
          <Duration initialDuration={duration} hasEnded={hasEnded} />
        )}
        <div className='flex-grow bg-[--media-secondary-color]'></div>
        <MediaVolumeRange />
        <MediaMuteButton />
      </MediaControlBar>
    </MediaController>
  )
}

export default LiveVideoPlayer