import type { NextPage } from 'next'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

interface Props {
  stream: string
}

const FeedPage: NextPage<Props> = () => {
  const router = useRouter()
  const { url } = router.query

  const [ streamFile, updateStreamFile ] = useState('')
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
      console.log({ data })

      updateStreamFile(data.file)
    }

    if (url) {
      startStream()
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
      updateTranscriptions(state => [...state, data.transcription])
      updateTranslations(state => [...state, data.translation])
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
      <iframe src={`${url}/embeddedplayer/live?auto_play=true&default_mute=false`} width="640px" height="360px" frameBorder="0"></iframe>

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

export default FeedPage
