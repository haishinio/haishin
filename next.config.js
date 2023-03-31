const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  env: {
    HAISHIN_VERSION: process.env.HAISHIN_VERSION
  },
  sentry: {
    hideSourceMaps: true,
  },
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/transcribe/live': ['./utils/**/*'],
      '/api/transcribe/archive': ['./utils/**/*'],
    },
  },
  reactStrictMode: true,
  swcMinify: true,
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);