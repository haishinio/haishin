import {getStreamInfo, setupStream} from "./setup-stream";
import splitVideoFile from "./split-video-file";
import transcribeTranslatePart from "./transcribe-translate-part";

export {
  getStreamInfo,
  setupStream,
  splitVideoFile,
  transcribeTranslatePart
};

const transcriber = {
  getStreamInfo,
  setupStream,
  splitVideoFile,
  transcribeTranslatePart
}

export default transcriber;
