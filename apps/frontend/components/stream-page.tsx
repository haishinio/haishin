'use client'

import { useEffect, useRef, useState } from 'react'
import LiveVideoPlayer from './live-video-player'
import Spinner from './spinner'
import TopMenu from './top-menu'
import TextLogRow from './textlog-row'
import Alert from './alert'

import useWindowDimension from '../hooks/useWindowHeight'

import type { TextLog } from '../types/Textlog'

interface Props {
  controlTranscription: () => void
  isTranscribing: boolean
  originalUrl: string
  streamId?: string
  streamUrl: string
  textLogs: TextLog[]
  updateEnded: () => void
}

const StreamPage = (props: Props): React.JSX.Element => {
  const {
    controlTranscription,
    streamId,
    isTranscribing,
    originalUrl,
    streamUrl,
    textLogs,
    updateEnded
  } = props

  // Set logHeight
  const size = useWindowDimension()
  const ref = useRef<HTMLDivElement>(null)
  const [logHeight, setLogHeight] = useState(0)
  useEffect(() => {
    if (ref?.current?.clientHeight != null) {
      const videoHeight = ref.current.clientHeight

      setLogHeight(size.height - videoHeight)
    }
  }, [size])

  return (
    <div className='h-screen overflow-hidden'>
      <div className='grid grid-cols-12 content-start'>
        <div className='col-span-12 xl:col-span-8' ref={ref}>
          <TopMenu url={originalUrl} />

          <div className='aspect-w-16 aspect-h-9'>
            {streamId != null && (
              <LiveVideoPlayer
                streamId={streamId}
                url={streamUrl}
                updateEnded={updateEnded}
              />
            )}
          </div>

          <div
            className='bg-zinc-700 text-white cursor-pointer px-2 py-1 text-center'
            onClick={() => {
              controlTranscription()
            }}
          >
            {isTranscribing
              ? 'Stop transcribing+translating'
              : 'Start transcribing+translating'}
          </div>

          <div className='hidden xl:block mx-32 mt-12'>
            <Alert />
          </div>
        </div>

        <div
          className={`col-span-12 xl:col-span-4 xl:!max-h-screen overflow-auto`}
          style={{ maxHeight: `${logHeight}px` }}
        >
          <table className='w-full table-fixed'>
            <tbody>
              {textLogs.length < 1 && (
                <tr>
                  <td className='p-2 w-20 text-center'>
                    <Spinner />
                  </td>
                  <td className='animate-pulse'>
                    <div className='h-6 bg-slate-200 rounded m-2'></div>
                  </td>
                  <td className='animate-pulse'>
                    <div className='h-6 bg-slate-200 rounded m-2'></div>
                  </td>
                </tr>
              )}
              {textLogs.map((textLog: TextLog) => (
                <tr key={textLog.id} className='odd:bg-white even:bg-slate-100'>
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
