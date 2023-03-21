import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import TopMenu from './top-menu'
import TextLogRow from './textlog-row'

import useWindowDimension from '../hooks/useWindowHeight'

import type { TextLog } from '../types/Textlog'

type Props = {
  controlTranscription: Function
  isTranscribing: boolean
  isTwitcasting: boolean
  originalUrl: string | string[] | undefined
  streamUrl: string | string[] | undefined
  textLogs: TextLog[]
  updateFileDuration: Function
}

const StreamPage = (props: Props) => {
  const { controlTranscription, isTranscribing, isTwitcasting, originalUrl, streamUrl, textLogs, updateFileDuration } = props

  // Set logHeight
  const size = useWindowDimension()
  const ref = useRef(null)
  const [logHeight, setLogHeight] = useState(0)
  useEffect(() => {
    if (ref.current.clientHeight) {
      const videoHeight = ref.current.clientHeight
      setLogHeight(window.screen.availHeight - videoHeight - 80)
    }
  }, [size])

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
                <ReactPlayer url={streamUrl} controls playing width='100%' height='100%' onDuration={(duration) => updateFileDuration(duration)} />
              </div>
            )
          }

          <div
            className="bg-zinc-700 text-white cursor-pointer px-2 py-1 text-center"
            onClick={() => controlTranscription()}
          >
            {
              isTranscribing ?
              'Pause transcribing+translating' :
              'Start transcribing+translating'
            }
          </div>
        </div>

        <div className={`col-span-12 xl:col-span-4 xl:!max-h-screen overflow-auto`} style={{maxHeight: `${logHeight}px`}}>
          <table className="w-full">
            <tbody>
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
