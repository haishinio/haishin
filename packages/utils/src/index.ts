import {
  getPathsByUrl,
  setFileName,
  setArchivedFileName
} from './set-file-name'
import { pathToData } from './path-to-data'
import { msToSeconds, secondsToDuration } from './seconds-to-duration'
import { isRtmpSite } from './rtmp-sites'
import urlUtils from './url-utils'

export {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  pathToData,
  setArchivedFileName,
  setFileName,
  secondsToDuration,
  urlUtils
}

const utils = {
  getPathsByUrl,
  isRtmpSite,
  msToSeconds,
  pathToData,
  secondsToDuration,
  setArchivedFileName,
  setFileName,
  url: urlUtils
}

export default utils
