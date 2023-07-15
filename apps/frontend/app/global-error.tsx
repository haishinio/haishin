'use client'

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
 
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

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}