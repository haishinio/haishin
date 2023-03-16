import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player'

interface Props {
  stream: string
}

const StreamPage: NextPage<Props> = () => {
  const router = useRouter()
  const { url } = router.query

  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState('0')
  const [ duration, updateDuration ] = useState('10')

  const [ transcriptions, updateTranscriptions ] = useState([])
  const [ translations, updateTranslations ] = useState([])
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
      updateTranscriptions(state => [data.transcription, ...state])
      updateTranslations(state => [data.translation, ...state])
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
        <h1>Transcriptions</h1>
        {transcriptions.map((transcription) => (
          <p key={transcription}>{transcription}</p>
        ))}
      </div>
      <div>
        <h1>Translations</h1>
        {translations.map((translation) => (
          <p key={translation}>{translation}</p>
        ))}
      </div>
    </div>
  )
}

export default StreamPage
