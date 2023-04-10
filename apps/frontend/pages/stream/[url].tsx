import type { NextPage } from 'next'

import io from 'socket.io-client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { secondsToDuration } from '../../utils/seconds-to-duration'

import StreamPage from '../../components/stream-page'

import type { Socket } from 'socket.io-client'
import type { TextLog } from '../../types/Textlog'
import type { UrlQuery } from '../../types/UrlQuery'

let socket: Socket;

const StreamUrlPage: NextPage = () => {
  const router = useRouter()
  const { url } = router.query as UrlQuery

  // Setup Stream
  const [ isTwitcasting, setIsTwitcasting ] = useState(false)
  const [ streamUrl, updateStreamUrl ] = useState(url)
  
  // Transcriptions
  const [ isTranscribing, setIsTranscribing ] = useState(false)
  const [ textLogs, updateTextLogs ] = useState<TextLog[]>([])

  // Starts capturing the stream
  useEffect(() => {
    socket = io(`http://localhost:8080`, {
      autoConnect: false,
      query: {
        'streamUrl': url
      }
    })

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('started-archiving', () => {
      setIsTranscribing(true)
    })

    socket.on('transcription-translation', (data) => {
      console.log({ data })
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
  
      if (url?.includes('twitcasting')) {
        setIsTwitcasting(true)
      }
    }
  }, [url])

  // Start/Stop transcribing the stream
  const controlTranscription = async () => {
    const nextState = !isTranscribing

    if (nextState) {
      // Leave the room
      socket.emit('leave-room', { room: url })
    } else {
      // Join the room
      socket.emit('join-room', { room: url })
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
            isTwitcasting={isTwitcasting}
            originalUrl={url}
            streamUrl={streamUrl}
            textLogs={textLogs}
            updateFileDuration={() => {}}
          />
        ) : (
          <p>LOADING</p>
        )
      }
    </>
  )
}

export default StreamUrlPage