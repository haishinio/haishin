'use client'

import io from 'socket.io-client'

import { useCallback, useEffect, useState } from 'react'

import { secondsToDuration } from '@haishin/utils'

import Loading from '../../../components/loading'
import StreamPage from '../../../components/stream-page'

import type { Socket } from 'socket.io-client'
import type { TextLog } from '../../../types/Textlog'

let socket: Socket

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

    socket = io(socketUrl, {
      autoConnect: false,
      query: {
        streamUrl: url
      }
    })

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('stream-error', () => {
      window.location.href = '/stream-error'
    })

    socket.on('start-transcribing', (data) => {
      setIsTranscribing(true)

      updateStreamUrl(data.streamUrl)
    })

    socket.on('transcription-translation', (data) => {
      if (data.transcription !== '' && data.translation !== '') {
        updateTextLogs((state) => [
          {
            id: data.id,
            time: secondsToDuration(data.startTime),
            transcription: data.transcription,
            translation: data.translation
          },
          ...state
        ])
      } else {
        console.log('No transcription+translation made...')
      }
    })

    if (!socket.connected && url !== '') {
      socket.connect()
    }

    return () => {
      console.log('disconnecting from socket...')
      socket.disconnect()
    }
  }, [url])

  // Start/Stop transcribing the stream
  const controlTranscription = (): void => {
    const nextState = !isTranscribing

    if (!nextState) {
      // Leave the room
      socket.emit('leave-stream-transcription', { room: url })
    } else {
      // Join the room
      socket.emit('join-stream-transcription', { room: url })
    }

    setIsTranscribing(nextState)
  }

  const updateEnded = useCallback((): (() => void) => {
    console.log('Stream ended...')
    const timeout = setTimeout(
      () => {
        socket.disconnect()
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
          isRtmp={true}
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
