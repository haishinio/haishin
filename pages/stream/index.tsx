import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StreamPage from '../../components/stream-page'

import type { TextLog } from '../../types/Textlog'

const StreamIndex: NextPage = () => {
  const router = useRouter()
  const { url } = router.query

  const [ fileDuration, updateFileDuration ] = useState(0)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  // Starts transcribing+translating the stream
  useEffect(() => {
    async function transcribeTranslate() {
      const response = await fetch('/api/transcribe/archive', {
        method: 'POST',
        body: JSON.stringify({
          streamFile: `./public/${url}`,
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
          <StreamPage isTwitcasting={false} originalUrl={url} streamUrl={url} textLogs={textLogs} updateFileDuration={updateFileDuration} />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamIndex
