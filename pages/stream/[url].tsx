import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import ReactPlayer from 'react-player'

import TextLogRow from '../../components/textlog-row'

import type { TextLog } from '../../types/Textlog'

const StreamPage: NextPage = () => {
  const router = useRouter()
  const { url } = router.query

  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState('0')
  const [ duration, updateDuration ] = useState('10')

  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])
  const [ prompt, updatePrompt ] = useState('')

  // Starts capturing the stream
  useEffect(() => {
    async function startStream() {
      const response = await fetch('/api/stream', {
        method: 'POST',
        body: JSON.stringify({
          url: url
        })
      })
      const data = await response.json()

      updateStreamFile(data.file)

      if (url?.includes('showroom')) {
        // For showroom we can use the actual streamUrl in react-video
        updateStreamUrl(data.streamUrl)
      }
    }

    if (url) {
      startStream()
    }

    // We need to use the twitcasting embed rather than react-video
    if (url?.includes('twitcasting')) {
      setIsTwitcasting(true)
    }
  }, [url])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe/live', {
        method: 'POST',
        body: JSON.stringify({
          streamFile,
          startTime,
          duration,
          prompt
        })
      })

      const data = await response.json()
      updateTextLogs(state => [{
        id: uuidv4(),
        time: format(new Date(), 'H:mm'),
        transcription: data.transcription,
        translation: data.translation,
      }, ...state])
      updatePrompt(data.transcription)

      const newStartTime = parseInt(startTime) + parseInt(duration)
      updateStartTime(newStartTime.toString())
    }

    // Thinking when the variables change it should rerun this and so waits another 10seconds automatically
    setTimeout(() => {
      if (streamFile && startTime) {
        transcribeTranslate()
      }
    }, parseInt(duration) * 1000)
  }, [duration, prompt, startTime, streamFile])

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-12 content-start">
        <div className="h-fit col-span-12 xl:col-span-8">
          {
            isTwitcasting ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe src={`${streamUrl}/embeddedplayer/live?auto_play=true&default_mute=false`} width='100%' height='100%' />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer url={streamUrl} controls playing width='100%' height='100%' />
              </div>
            )
          }
        </div>

        <div className="col-span-12 xl:col-span-4 max-h-96 xl:max-h-screen overflow-auto">
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
