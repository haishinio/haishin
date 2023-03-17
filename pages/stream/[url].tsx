import type { NextPage } from 'next'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import ReactPlayer from 'react-player'

import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'

const StreamUrl: NextPage = () => {
  const router = useRouter()
  const { url } = router.query

  // Setup Stream
  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState('0')
  const [ duration, updateDuration ] = useState('10')

  // Transcriptions
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

      // If we get no transcription and no translation back then presume the stream has ended and don't update
      if (data.transcription !== '' && data.translation !== '') {
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
    }

    // Thinking when the variables change it should rerun this and so waits another 10seconds automatically
    setTimeout(() => {
      if (streamFile && startTime) {
        transcribeTranslate()
      }
    }, parseInt(duration) * 1000)
  }, [duration, prompt, startTime, streamFile])

  return (
    <>
      {
        url ? (
          <StreamPage isTwitcasting={isTwitcasting} streamUrl={streamUrl} textLogs={textLogs} updateFileDuration={() => {}} />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamUrl
