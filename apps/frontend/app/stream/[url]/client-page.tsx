'use client'

import { useCallback, useEffect, useState } from 'react'

import { secondsToDuration } from '@haishin/utils'

import Loading from '../../../components/loading'
import StreamPage from '../../../components/stream-page'

import type { TextLog } from '../../../types/Textlog'

let socket: WebSocket

interface Props {
  streamId: string
  url: string
}

const StreamUrlPage = ({ streamId, url }: Props): React.JSX.Element => {
  // Setup Stream
  const [streamUrl, updateStreamUrl] = useState('')

  // Transcriptions
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [textLogs, updateTextLogs] = useState<TextLog[]>([])

  // Starts capturing the stream
  useEffect(() => {
    const socketUrl = process.env.WS_URL ?? `http://localhost:8080`

    socket = new WebSocket(`${socketUrl}?streamUrl=${url}`)

    socket.addEventListener('open', () => {
      console.log('connected')
    })

    socket.addEventListener('stream-error', () => {
      window.location.href = '/stream-error'
    })

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)

      console.log({ data })

      if (data.type === 'start-transcribing') {
        setIsTranscribing(true)
        updateStreamUrl(data.content.streamUrl)
      }

      if (data.type === 'transcription-translation') {
        const { id, startTime, transcription, translation } = data.content

        if (transcription !== '' && translation !== '') {
          updateTextLogs((state) => [
            {
              id,
              time: secondsToDuration(startTime),
              transcription,
              translation
            },
            ...state
          ])
        } else {
          console.log('No transcription+translation made...')
        }
      }
    })

    return () => {
      console.log('disconnecting from socket...')
      socket.close()
    }
  }, [url])

  // Start/Stop transcribing the stream
  const controlTranscription = (): void => {
    const nextState = !isTranscribing

    if (!nextState) {
      // Leave the room
      socket.send('leave-stream-transcription')
    } else {
      // Join the room
      socket.send('join-stream-transcription')
    }

    setIsTranscribing(nextState)
  }

  const updateEnded = useCallback((): (() => void) => {
    console.log('Stream ended...')
    const timeout = setTimeout(
      () => {
        socket.close()
      },
      1000 * 60 * 2
    ) // 2mins

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {streamUrl !== '' ? (
        <StreamPage
          controlTranscription={controlTranscription}
          isTranscribing={isTranscribing}
          originalUrl={url}
          streamId={streamId}
          streamUrl={streamUrl}
          textLogs={textLogs}
          updateFileDuration={() => {}}
          updateEnded={updateEnded}
        />
      ) : (
        <Loading
          className='h-screen w-screen text-2xl'
          message={`Getting stream data for ${url}`}
        />
      )}
    </>
  )
}

export default StreamUrlPage
