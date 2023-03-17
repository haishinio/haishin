import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'
import TextLogRow from '../../components/textlog-row'

import type { TextLog } from '../../types/Textlog'

const StreamPage: NextPage = () => {
  const router = useRouter()
  const { url } = router.query

  const [ fileDuration, updateFileDuration ] = useState(0)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe/archive', {
        method: 'POST',
        body: JSON.stringify({
          streamFile: `./public/${url}`,
          fileDuration
        })
      })

      const data = await response.json()
      updateTextLogs(data.textLogs)
    }

    if (url && fileDuration) {
      transcribeTranslate()
    }
  }, [fileDuration, url])

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-12 xl:gap-4 content-start">
        <div className="h-fit col-span-12 xl:col-span-5">
          {
            url && (
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer url={url} onDuration={(duration) => updateFileDuration(duration)} controls playing width='100%' height='100%' />
              </div>
            )
          }
        </div>

        <div className="col-span-12 xl:col-span-7 max-h-96 xl:max-h-screen overflow-auto">
          <table className="table-auto">
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
