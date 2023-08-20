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
  initialDuration: number
  url: string
}

const StreamUrlPage = ({ initialDuration, url }: Props): JSX.Element => {
  console.log({ initialDuration, url })

  // Setup Stream
  const [streamUrl, updateStreamUrl] = useState('')
  // const [streamComplete, setStreamComplete] = useState(false) // We'll use streamComplete later to change things
  const [, setStreamComplete] = useState(false)

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

  let updateEnded = useCallback((): (() => void) => {
    updateEnded = () => () => {}

    setStreamComplete(true)

    updateTextLogs((state) => [
      {
        id: 'end',
        time: 'Complete',
        transcription: '配信は終了しました',
        translation: 'Stream has ended'
      },
      ...state
    ])
    socket.disconnect()

    return () => {}
  }, [])

  return (
    <>
      {streamUrl !== '' ? (
        <StreamPage
          controlTranscription={controlTranscription}
          isRtmp={true}
          isTranscribing={isTranscribing}
          originalUrl={url}
          streamUrl={streamUrl}
          textLogs={textLogs}
          updateFileDuration={() => {}}
          updateEnded={updateEnded}
        />
      ) : (
        <div className='h-screen w-screen flex content-center items-center mx-auto text-center'>
          <div className='w-full text-2xl'>
            <Loading message={`Getting stream data for ${url}`} />
          </div>
        </div>
      )}
    </>
  )
}

export default StreamUrlPage
