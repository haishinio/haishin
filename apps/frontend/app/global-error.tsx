'use client'

import '../styles/globals.css';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface ArtistSong {
  group: string
  url: string
}
const getRandomElement = (array: ArtistSong[]) => array[Math.floor(Math.random() * array.length)];
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    async function logError() {
      await Sentry.captureException(error);
    }

    logError();
  }, [error])

  const randomArtistSong = getRandomElement([
    { group: 'iWannaDay', url: 'https://www.youtube.com/watch?v=Rdr29nn2brs' },
    { group: 'Papimuzu', url: 'https://www.youtube.com/watch?v=f6hbUZxnkTU' },
    { group: 'Amesola', url: 'https://www.youtube.com/watch?v=z_-tJbK8Bsk' }
  ])

  return (
    <html>
      <body>
        <div className="min-h-screen w-full max-w-screen-md mx-auto text-center flex items-center">
          <div className="w-full">
            <h1 className="text-4xl mb-8">
              Haishin
              <small className="block text-xl">- 配信 -</small>
            </h1>
            <h2 className="text-lg">Big error!!</h2>
            <p>Something went terribly wrong here, feel free to try again with the button below and also give <a href="https://twitter.com/tomouchuu" target="_blank" className="underline">Thomas</a> a buzz to see if it can be fixed!</p>
            <p>While you wait, how about some <a href={randomArtistSong.url} target="_blank" className="underline">{randomArtistSong.group}</a>?</p>
            <button className="mt-8 pt-2 px-16 pb-3 rounded bg-sky-700 text-white hover:bg-sky-600 transition-colors duration-100" onClick={() => reset()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  )
}