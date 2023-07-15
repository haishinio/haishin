'use client';

import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'

const StreamIndex: NextPage = () => {
  const searchParams = useSearchParams()
  const url = searchParams?.get('url') as string

  const [ streamUrl, setStreamUrl ] = useState('')
  const [ fileDuration, updateFileDuration ] = useState(0)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  useEffect(() => {   
    if (url) {
      const cleanUrl = encodeURIComponent(url);
      setStreamUrl(`/api/stream/${cleanUrl}`)
    }
  }, [url])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: JSON.stringify({
          streamFile: `./data/${url}`,
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
    <>
      {
        url ? (
          <StreamPage
            controlTranscription={() => {}}
            isRtmp={false}
            isTranscribing={true}
            originalUrl={url}
            streamUrl={streamUrl}
            textLogs={textLogs}
            updateFileDuration={updateFileDuration}
          />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamIndex
