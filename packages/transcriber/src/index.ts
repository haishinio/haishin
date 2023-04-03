import setupStream from "./setup-stream";
import splitVideoFile from "./split-video-file";
import transcribeTranslatePart from "./transcribe-translate-part";

export { setupStream, splitVideoFile, transcribeTranslatePart };

const transcriber = {
  setupStream,
  splitVideoFile,
  transcribeTranslatePart,
}

export default transcriber;
