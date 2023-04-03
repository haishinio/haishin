import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'
import type { UrlQuery } from '../../types/UrlQuery'

const StreamIndex: NextPage = () => {
  const router = useRouter()
  const { url } = router.query as UrlQuery

  const [ streamUrl, setStreamUrl ] = useState('')
  const [ fileDuration, updateFileDuration ] = useState(0)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  useEffect(() => {   
    if (url) {
      const cleanUrl = encodeURIComponent(url)
      setStreamUrl(`/api/stream/upload?filename=${cleanUrl}`)
    }
  }, [url])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe/archive', {
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
            isTranscribing={true}
            isTwitcasting={false}
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
