import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { differenceInSeconds, format } from 'date-fns'

import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'

const StreamUrlPage: NextPage = () => {
  const router = useRouter()
  const { url } = router.query

  // Setup Stream
  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamFile, updateStreamFile ] = useState('')
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ startTime, updateStartTime ] = useState('0')
  const [ splitTime, updateSplit ] = useState('10')

  // Transcriptions
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
      updateStartTime(streamDurationData.duration.toString())
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

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const startResTime = new Date()
      const response = await fetch('/api/transcribe/live', {
        method: 'POST',
        body: JSON.stringify({
          streamFile,
          startTime,
          splitTime,
          prompt
        })
      })

      const data = await response.json()
      const endResTime = new Date()
      const resTime = differenceInSeconds(endResTime, startResTime, { roundingMethod: 'ceil' })

      if (data.transcription !== '' && data.translation !== '') {
        updateTextLogs(state => [{
          id: uuidv4(),
          time: format(new Date(), 'H:mm:ss'),
          transcription: data.transcription,
          translation: data.translation,
        }, ...state])
        updatePrompt(data.transcription)
      } else {
        console.log('No transcription+translation made...')
      }

      const newStartTime = parseInt(startTime) + parseInt(splitTime)
      updateStartTime(newStartTime.toString())
      updateSplit(resTime.toString())
    }

    // Check we have a streamFile and startTime first
    if (streamFile && startTime) {
      // Check wether we need to wait 10 seconds before calling because we just started the archive
      if (splitTime === '0') {
        updateSplit('10')
      } else if (startTime === '0') {
        const transcribeTimeout = setTimeout(() => {
          transcribeTranslate()
        }, parseInt(splitTime) * 1000)
    
        return () => clearTimeout(transcribeTimeout)
      } else {
        transcribeTranslate()
      }
    }
  }, [splitTime, prompt, startTime, streamFile])

  return (
    <>
      {
        streamUrl ? (
          <StreamPage isTwitcasting={isTwitcasting} originalUrl={url} streamUrl={streamUrl} textLogs={textLogs} updateFileDuration={() => {}} />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamUrlPage
