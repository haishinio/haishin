// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5
  })
}
