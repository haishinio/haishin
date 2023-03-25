const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);