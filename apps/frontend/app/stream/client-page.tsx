'use client'

import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Loading from '../../components/loading'
import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'

const StreamIndex: NextPage = () => {
  const searchParams = useSearchParams()
  const url = searchParams?.get('url') as string

  if (url == null) window.location.href = '/stream-error'

  const [streamUrl, setStreamUrl] = useState('')
  const [fileDuration, updateFileDuration] = useState(0)
  const [textLogs, updateTextLogs] = useState<TextLog[]>([])

  useEffect(() => {
    if (url !== '') {
      const cleanUrl = encodeURIComponent(url)
      setStreamUrl(`/api/stream/${cleanUrl}`)
    }
  }, [url])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate(): Promise<void> {
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

    if (url !== '' && fileDuration !== 0) {
      void transcribeTranslate()
    }
  }, [fileDuration, url])

  return (
    <>
      {streamUrl !== '' ? (
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
        <Loading message='Setting up the upload...' />
      )}
    </>
  )
}

export default StreamIndex
