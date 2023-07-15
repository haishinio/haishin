'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import TopMenu from './top-menu';
import TextLogRow from './textlog-row';

import useWindowDimension from '../hooks/useWindowHeight';

import type { TextLog } from '../types/Textlog';

type Props = {
  controlTranscription: Function
  isRtmp: boolean
  isTranscribing: boolean
  originalUrl: string
  streamUrl: string
  textLogs: TextLog[]
  updateFileDuration?: Function
}

const StreamPage = (props: Props) => {
  const { controlTranscription, isRtmp, isTranscribing, originalUrl, streamUrl, textLogs, updateFileDuration } = props;

  // Set logHeight
  const size = useWindowDimension()
  const ref = useRef<HTMLDivElement>(null)
  const [logHeight, setLogHeight] = useState(0)
  useEffect(() => {
    if (window && ref.current && ref.current.clientHeight) {
      const videoHeight = ref.current.clientHeight
      setLogHeight(window.screen.availHeight - videoHeight)
    }
  }, [size])

  // Passes duration back up if we have it,
  // Needed for uploads
  const updateDuration = (duration: number | undefined) => {
    if (!updateFileDuration) return;

    if (duration === undefined) {
      throw new Error('No duration for file/stream')
    }
    
    return updateFileDuration(duration)
  }

  const FlvVideoPlayer = lazy(() => import('./flv-video-player'));

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-12 content-start">
        <div className="col-span-12 xl:col-span-8" ref={ref}>
          <TopMenu url={originalUrl} />

          <div className="aspect-w-16 aspect-h-9">
            {
              isRtmp ? (
                <Suspense>
                  <FlvVideoPlayer url={streamUrl} />
                </Suspense>
              ) : (
                <ReactPlayer
                  url={streamUrl}
                  height='100%'
                  width='100%'
                  controls
                  playing
                  playsinline
                  onDuration={updateDuration}
                />
              )
            }
          </div>

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
