import fs from 'fs'
import exec from 'await-exec'
import { pathToData, urlUtils } from '@haishin/utils'

import type { StreamDataResponse } from '../types/responses.js'

export const getStreamInfo = async function (
  originalUrl: string
): Promise<StreamDataResponse> {
  // Should check if we can play the stream at all (ie. use streamlink)
  let canPlay = false

  try {
    await exec(`streamlink --json ${originalUrl} --retry-open 5`)

    canPlay = true
  } catch (error) {
    console.log({ canPlayError: error })
  }

  const streamsDir = pathToData('live')

  const safeUrl = urlUtils.encodeUrl(originalUrl)

  const streams = fs.readdirSync(streamsDir)

  let newStream = false
  const [filteredStream] = streams.filter((stream) => stream.includes(safeUrl))

  console.log({ streams, filteredStream })

  // If we don't have filteredFile then it's a newStream
  if (filteredStream === undefined) newStream = true

  const streamUrl = `${process.env.RTMP_CLIENT_URL ?? ''}${safeUrl}/index.m3u8`

  const file = pathToData(`live/${safeUrl}/stream.mp4`)
  const streamFile = pathToData(`live/${safeUrl}/index.m3u8`)

  return {
    // Utils
    canPlay,
    newStream,
    // Name
    id: safeUrl,
    // Urls
    originalUrl,
    streamUrl,
    // Files
    folder: streamsDir,
    file,
    streamFile
  }
}

export default getStreamInfo
