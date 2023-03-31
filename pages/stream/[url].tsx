import type { NextPage } from 'next'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { secondsToDuration } from '../../utils/seconds-to-duration'

import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'
import type { UrlQuery } from '../../types/UrlQuery'

const StreamUrlPage: NextPage = () => {
  const router = useRouter()
  const { url } = router.query as UrlQuery

  // Setup Stream
  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState(0)
  const [ splitTime, updateSplit ] = useState(5)

  // Processes
  const isProcessingRef = useRef(false);
  
  // Transcriptions
  const [ isTranscribing, setIsTranscribing ] = useState(true)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])
  const [ prompt, updatePrompt ] = useState('')

  // Starts capturing the stream
  useEffect(() => {
    async function startStream() {
      const startStreamRes = await fetch('/api/stream', {
        method: 'POST',
        body: JSON.stringify({
          url: url
        })
      })
      const startStreamData = await startStreamRes.json()

      updateStreamFile(startStreamData.file)
      if (url?.includes('showroom')) {
        // For showroom we can use the actual streamUrl in react-video
        updateStreamUrl(startStreamData.streamUrl)
      }

      const streamDurationRes = await fetch('/api/stream/duration', {
        method: 'POST',
        body: JSON.stringify({
          streamFile: startStreamData.file
        })
      })
      const streamDurationData = await streamDurationRes.json()
      updateStartTime(streamDurationData.duration)
    }

    const startTimeout = setTimeout(() => {
      if (url) {
        updateStreamUrl(url)
        startStream()
      }
  
      // We need to use the twitcasting embed rather than react-video
      if (url?.includes('twitcasting')) {
        setIsTwitcasting(true)
      }
    }, 1000)

    return () => clearTimeout(startTimeout)
  }, [url])

  // Transcribing+translating the stream effect
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe/live', {
        method: 'POST',
        body: JSON.stringify({
          streamFile,
          startTime,
          prompt
        })
      })

      const data = await response.json()
      if (data.transcription !== '' && data.translation !== '') {
        updateTextLogs(state => [{
          id: uuidv4(),
          time: secondsToDuration(startTime),
          transcription: data.transcription,
          translation: data.translation,
        }, ...state])
        updatePrompt(data.transcription)
      } else {
        console.log('No transcription+translation made...')
      }

      if (data.nextStartTime === -1) {
        setIsTranscribing(false)
      } else {
        updateStartTime(data.nextStartTime)
      }

      isProcessingRef.current = false
    }
    
    // Check we 
    if (
      isTranscribing && // can transcribe
      streamFile && // we have a stream file
      startTime && // we've updated the duration
      !isProcessingRef.current // we're not already processing
    ) {
      if (startTime === 0.1) {
        // This is a hack to get around the fact that the duration isn't updated
        // before the first transcription is made
        setTimeout(() => {
          isProcessingRef.current = true
          transcribeTranslate()
        }, 10000)
      } else {
        isProcessingRef.current = true
        transcribeTranslate()
      }
    }
  }, [isTranscribing, splitTime, prompt, startTime, streamFile])

  // Start/Stop transcribing the stream
  const controlTranscription = async () => {
    const nextState = !isTranscribing

    // If we're going to be starting again we need to get the latest duration
    if (nextState) {
      const streamDurationRes = await fetch('/api/stream/duration', {
        method: 'POST',
        body: JSON.stringify({
          streamFile: streamFile
        })
      })
      const streamDurationData = await streamDurationRes.json()
      updateStartTime(streamDurationData.duration.toString())
    }

    setIsTranscribing(nextState)
  }

  return (
    <>
      {
        streamUrl ? (
          <StreamPage
            controlTranscription={controlTranscription}
            isTranscribing={isTranscribing}
            isTwitcasting={isTwitcasting}
            originalUrl={url}
            streamUrl={streamUrl}
            textLogs={textLogs}
            updateFileDuration={() => {}}
          />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamUrlPage
