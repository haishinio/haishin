import {
  getPathsByUrl,
  setFileName,
  setArchivedFileName
} from './set-file-name'
import { pathToData } from './path-to-data'
import { msToSeconds, secondsToDuration } from './seconds-to-duration'
import urlUtils from './url-utils'

export {
  getPathsByUrl,
  msToSeconds,
  pathToData,
  setArchivedFileName,
  setFileName,
  secondsToDuration,
  urlUtils
}

const utils = {
  getPathsByUrl,
  msToSeconds,
  pathToData,
  secondsToDuration,
  setArchivedFileName,
  setFileName,
  url: urlUtils
}

export default utils
