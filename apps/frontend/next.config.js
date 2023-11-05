const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
  env: {
    WS_URL: process.env.WS_URL
  },
  sentry: {
    hideSourceMaps: true
  },
  experimental: {
    serverActions: true
  },
  reactStrictMode: true,
  swcMinify: true
}

const sentryWebpackPluginOptions = {
  silent: true // Suppresses all logs
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
