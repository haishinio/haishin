import * as Sentry from "@sentry/node";

import setupStream from "./setup-stream";
import splitVideoFile from "./split-video-file";
import transcribeTranslatePart from "./transcribe-translate-part";

export { setupStream, splitVideoFile, transcribeTranslatePart };

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const transcriber = {
  setupStream,
  splitVideoFile,
  transcribeTranslatePart,
}

export default transcriber;
