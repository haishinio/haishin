const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
  env: {
    HAISHIN_VERSION: process.env.HAISHIN_VERSION,
    WS_URL: process.env.WS_URL
  },
  sentry: {
    hideSourceMaps: true
  },
  output: 'standalone',
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
