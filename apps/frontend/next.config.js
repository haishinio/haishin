const path = require("path");
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
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  reactStrictMode: true,
  swcMinify: true,
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);