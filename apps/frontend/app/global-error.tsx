'use client'

import '../styles/globals.css'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import useRandomArtistSong from '../hooks/useRandomArtistSong'

export default function GlobalError({
  error,
  reset
}: {
  error: Error
  reset: () => void
}): React.JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    function logError(): void {
      Sentry.captureException(error)
    }

    logError()
  }, [error])

  const randomArtistSong = useRandomArtistSong()

  return (
    <html>
      <body>
        <div className='min-h-screen w-full max-w-screen-md mx-auto text-center flex items-center'>
          <div className='w-full'>
            <h1 className='text-6xl'>
              Haishin
              <small className='block text-3xl'>- 配信 -</small>
            </h1>
            <h2 className='text-xl'>Big error!!</h2>
            <p>
              Something went terribly wrong here, feel free to try again with
              the button below and also give{' '}
              <a
                href='https://twitter.com/tomouchuu'
                target='_blank'
                className='underline'
              >
                Thomas
              </a>{' '}
              a buzz to see if it can be fixed!
            </p>
            <p>
              While you wait, how about some{' '}
              <a
                href={randomArtistSong.url}
                target='_blank'
                className='underline'
              >
                {randomArtistSong.group}
              </a>
              ?
            </p>
            <button
              className='mt-8 pt-2 px-16 pb-3 rounded bg-sky-700 text-white hover:bg-sky-600 transition-colors duration-100'
              onClick={() => {
                reset()
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
