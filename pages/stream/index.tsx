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

  const [ fileDuration, updateFileDuration ] = useState(0)
  const [ transcriptions, updateTranscriptions ] = useState([])
  const [ translations, updateTranslations ] = useState([])

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
      updateTranscriptions(data.transcriptions)
      updateTranslations(data.translations)
    }

    if (url && fileDuration) {
      transcribeTranslate()
    }
  }, [fileDuration, url])

  return (
    <div>
      {
        url && (
          <ReactPlayer url={url} onDuration={(duration) => updateFileDuration(duration)} controls playing />
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
