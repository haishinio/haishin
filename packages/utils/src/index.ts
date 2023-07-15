import { getPathsByUrl, setFileName } from "./set-file-name";
import { msToSeconds, secondsToDuration } from "./seconds-to-duration";
import { isRtmpSite } from "./rtmp-sites";

export {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  setFileName,
  secondsToDuration
};

const utils = {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  setFileName,
  secondsToDuration
}

export default utils;
