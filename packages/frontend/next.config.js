const { withSentryConfig } = require("@sentry/nextjs");

const requiredFiles = [
  './utils/**/*',
  './node_modules/regenerator-runtime/**/*',
  './node_modules/node-fetch/**/*',
  './node_modules/whatwg-url/**/*',
  './node_modules/webidl-conversions/**/*',
  './node_modules/tr46/**/*',
  './node_modules/is-url/**/*',
]

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
      '/api/transcribe/live': requiredFiles,
      '/api/transcribe/archive': requiredFiles,
    },
  },
  reactStrictMode: true,
  swcMinify: true,
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);