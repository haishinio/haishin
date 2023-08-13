import {
  getPathsByUrl,
  setFileName,
  setArchivedFileName
} from './set-file-name'
import { pathToData } from './path-to-data'
import { msToSeconds, secondsToDuration } from './seconds-to-duration'
import { isRtmpSite } from './rtmp-sites'

export {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  pathToData,
  setArchivedFileName,
  setFileName,
  secondsToDuration
}

const utils = {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  pathToData,
  secondsToDuration,
  setArchivedFileName,
  setFileName
}

export default utils
