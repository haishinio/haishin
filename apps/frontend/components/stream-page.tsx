import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import TopMenu from './top-menu'
import TextLogRow from './textlog-row'

import useWindowDimension from '../hooks/useWindowHeight'

import * as Sentry from "@sentry/nextjs"

import type { TextLog } from '../types/Textlog'
import FilePlayer from "react-player/file"

type Props = {
  controlTranscription: Function
  isTranscribing: boolean
  isTwitcasting: boolean
  originalUrl: string
  streamUrl: string
  textLogs: TextLog[]
  updateFileDuration?: Function
  onBufferEnd?: Function
  videoRef?: React.RefObject<ReactPlayer>
}

const StreamPage = (props: Props) => {
  const { controlTranscription, isTranscribing, isTwitcasting, originalUrl, streamUrl, textLogs, updateFileDuration, videoRef } = props;

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoKey, setVideoKey] = useState(0);
  const [lastPlayedPosition, setLastPlayedPosition] = useState(0);

  // Set logHeight
  const size = useWindowDimension()
  const ref = useRef<HTMLDivElement>(null)
  const [logHeight, setLogHeight] = useState(0)
  useEffect(() => {
    if (ref.current && ref.current.clientHeight) {
      const videoHeight = ref.current.clientHeight
      setLogHeight(window.screen.availHeight - videoHeight)
    }
  }, [size])

  // Passes duration back up if we have it
  const updateDuration = (duration: number | undefined) => {
    if (!updateFileDuration) return;
    console.log({ duration });

    if (duration === undefined) {
      throw new Error('No duration for file/stream')
    }
    
    return updateFileDuration(duration)
  }

  const handlePlayerReady = () => {
    // Seek to the last played position and start playing
    // videoRef?.current?.seekTo(lastPlayedPosition, 'seconds');
    // setIsPlaying(true);
  };

  const handleProgress = (progress: { playedSeconds: number }) => {
    // Update the last played position in the component's state
    // setLastPlayedPosition(progress.playedSeconds);
  };

  const onEnded = () => {
    // const prevLoaded = videoRef?.current?.getSecondsLoaded() as number;
    
    // setIsPlaying(false);

    // setVideoKey(prevKey => prevKey + 1);
  }

  // Error handler
  const onErrors = (error: any, data?: any) => {
    console.log({ error, data });

    Sentry.captureException(new Error('ReactPlayer error'), scope => {
      scope.clear()
      scope.setExtra('errorObj', error)
      scope.setExtra('streamData', data)
      return scope
    })
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-12 content-start">
        <div className="col-span-12 xl:col-span-8" ref={ref}>
          <TopMenu url={originalUrl} />
          {
            isTwitcasting ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe src={`${streamUrl}/embeddedplayer/live?auto_play=true&default_mute=false`} width='100%' height='100%' />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer
                  url={streamUrl}
                  height='100%'
                  width='100%'
                  controls
                  playing={isPlaying}
                  playsinline
                  onReady={handlePlayerReady}
                  onDuration={updateDuration}
                  onProgress={handleProgress}
                  onEnded={onEnded}
                  onError={onErrors}
                  ref={videoRef}
                  key={videoKey}
                  // config={{ file: { forceHLS: true, attributes: { preload: 'none' } } }}
                />
              </div>
            )
          }

          <div
            className="bg-zinc-700 text-white cursor-pointer px-2 py-1 text-center"
            onClick={() => controlTranscription()}
          >
            {
              isTranscribing ?
              'Stop transcribing+translating' :
              'Start transcribing+translating'
            }
          </div>
        </div>

        <div className={`col-span-12 xl:col-span-4 xl:!max-h-screen overflow-auto`} style={{maxHeight: `${logHeight}px`}}>
          <table className="w-full table-fixed">
            <tbody>
              {
                textLogs.length < 1 && (
                  <tr>
                    <td colSpan={3} className="text-center p-4">Loading...</td>
                  </tr>
                )
              }
              {textLogs.map((textLog: TextLog) => (
                <tr key={textLog.id} className="odd:bg-white even:bg-slate-100">
                  <TextLogRow textLog={textLog} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StreamPage
