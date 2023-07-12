'use client';

import type { NextPage } from 'next'

import io from 'socket.io-client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { secondsToDuration } from '../../../utils/seconds-to-duration'
// import { setFileName } from '@haishin/transcriber-utils';

import StreamPage from '../../../components/stream-page'

import ReactPlayer from 'react-player'
import type { Socket } from 'socket.io-client'
import type { TextLog } from '../../../types/Textlog'

let socket: Socket;

const StreamUrlPage: NextPage = () => {
  const pathName = usePathname();
  const encodedUrl = pathName?.replace('/stream/', '') as string;
  const url = decodeURIComponent(encodedUrl);

  const videoRef = useRef<ReactPlayer>(null);

  // Setup Stream
  const [ streamUrl, updateStreamUrl ] = useState(url);
  
  // Transcriptions
  const [ isTranscribing, setIsTranscribing ] = useState(false)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  // Starts capturing the stream
  useEffect(() => {
    const socketUrl = process.env.WS_URL || `http://localhost:8080`

    socket = io(socketUrl, {
      autoConnect: false,
      query: {
        'streamUrl': url
      }
    })

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('start-transcribing', (data) => {
      setIsTranscribing(true)

      console.log({ data });
      // Need to get the streamUrl here 'http://127.0.0.1:${port}'
    })

    socket.on('transcription-translation', (data) => {
      if (data.transcription !== '' && data.translation !== '') {
        updateTextLogs(state => [{
          id: data.id,
          time: secondsToDuration(data.startTime),
          transcription: data.transcription,
          translation: data.translation,
        }, ...state])
      } else {
        console.log('No transcription+translation made...')
      }
    })

    if (!socket.connected && url) {
      socket.connect()
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [url])

  useEffect(() => {
    if (url) {
      updateStreamUrl(url)
    }
  }, [url])

  // Start/Stop transcribing the stream
  const controlTranscription = async () => {
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

  return (
    <>
      {
        streamUrl ? (
          <StreamPage
            controlTranscription={controlTranscription}
            isTranscribing={isTranscribing}
            originalUrl={url}
            streamUrl={streamUrl}
            textLogs={textLogs}
            updateFileDuration={() => {}}
            videoRef={videoRef}
          />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamUrlPage
