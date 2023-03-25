const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  outputFileTracingIncludes: {
    '/api/stream': ['./utils/split-transcribe-translate.ts'],
    '/api/stream/duration': ['./utils/split-transcribe-translate.ts'],
    '/api/transcribe/archive': ['./utils/split-transcribe-translate.ts'],
    '/api/transcribe/live': ['./utils/split-transcribe-translate.ts'],
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);