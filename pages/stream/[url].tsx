import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import ReactPlayer from 'react-player'

interface Props {
  stream: string
}

interface Textlog {
  id: string
  date: string
  transcription: string
  translation: string
}

const StreamPage: NextPage<Props> = () => {
  const router = useRouter()
  const { url } = router.query

  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState('0')
  const [ duration, updateDuration ] = useState('10')

  const [ textLogs, updateTextLogs ] = useState<Textlog[]>([])
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
        date: format(new Date(), 'H:mm'),
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
    <div>
      {
        isTwitcasting ? (
          <iframe src={`${streamUrl}/embeddedplayer/live?auto_play=true&default_mute=false`} width="640px" height="360px"></iframe>
        ) : (
          <ReactPlayer url={streamUrl} controls playing />
        )
      }

      <div>
        <h1>Log</h1>
        <table>
          {textLogs.map((textLog: Textlog) => (
            <tr key={textLog.id}>
              <td>{textLog.date}</td>
              <td>{textLog.transcription}</td>
              <td>{textLog.translation}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export default StreamPage
