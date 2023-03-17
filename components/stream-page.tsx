import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import TextLogRow from './textlog-row'

import useWindowDimension from '../hooks/useWindowHeight'

import type { TextLog } from '../types/Textlog'

type Props = {
  isTwitcasting: boolean
  streamUrl: string | string[] | undefined
  textLogs: TextLog[]
  updateFileDuration: Function
}

const StreamPage = (props: Props) => {
  const { isTwitcasting, streamUrl, textLogs, updateFileDuration } = props

  const size = useWindowDimension()

  // Set logHeight
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
        <div className="h-fit col-span-12 xl:col-span-8" ref={ref}>
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
        </div>

        <div className={`col-span-12 xl:col-span-4 xl:!max-h-screen overflow-auto`} style={{maxHeight: `${logHeight}px`}}>
          <table className="table-auto w-full">
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
