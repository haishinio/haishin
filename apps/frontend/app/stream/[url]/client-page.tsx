'use client';

import type { NextPage } from 'next'

import io from 'socket.io-client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { secondsToDuration } from '@haishin/transcriber-utils'

import Loading from "../../../components/loading"
import StreamPage from '../../../components/stream-page'

import type { Socket } from 'socket.io-client'
import type { TextLog } from '../../../types/Textlog'

let socket: Socket;

const StreamUrlPage: NextPage = () => {
  const pathName = usePathname();
  const encodedUrl = pathName?.replace('/stream/', '') as string;
  const url = decodeURIComponent(encodedUrl);

  // Setup Stream
  const [ streamUrl, updateStreamUrl ] = useState('');
  const [ isRtmp, setIsRtmp ] = useState(false);
  
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

    socket.on('stream-error', () => {
      updateStreamUrl('https://www.youtube.com/watch?v=azB-_MlmhfI') // Obituary
      setIsTranscribing(false);
      updateTextLogs([{
        id: '0',
        time: '0:00',
        transcription: 'エラーが発生しました、もう一度お試しください',
        translation: 'There was an issue, please try again'
      }])
    });

    socket.on('start-transcribing', (data) => {
      setIsTranscribing(true);
      updateStreamUrl(data.streamUrl);

      if (data.streamUrl.includes('flv')) {
        setIsRtmp(true);
      }
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
        console.log('disconnecting from socket...');
        socket.disconnect()
      }
    }
  }, [url]);

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
            isRtmp={isRtmp}
            isTranscribing={isTranscribing}
            originalUrl={url}
            streamUrl={streamUrl}
            textLogs={textLogs}
            updateFileDuration={() => {}}
          />
        ) : (
          <div className="h-screen w-screen flex content-center items-center mx-auto text-center">
            <div className="w-full text-2xl">
              <Loading message="Getting stream data..." />
            </div>
          </div>
        )
      }
    </>
  )
}

export default StreamUrlPage
