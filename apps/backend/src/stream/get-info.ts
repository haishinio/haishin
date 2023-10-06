import fs from 'node:fs'
import path from 'node:path'

import { streamsFolder } from '../routes/streams'
import { encodeUrl } from '@haishin/utils/dist/url-utils'

export interface StreamInfo {
  // Utils
  canPlay: boolean
  newStream: boolean
  // Name
  id: string
  // Urls
  originalUrl: string
  streamUrl: string
  // Files
  folder: string
  file: string
  streamFile: string
}

export const getStreamInfo = async (
  originalUrl: string
): Promise<StreamInfo> => {
  let canPlay = null

  try {
    // Use streamlink to try open the stream
    const streamlinkCheck = Bun.spawn([
      'streamlink',
      '--json',
      originalUrl,
      '--retry-open',
      '5'
    ])
    const streamlinkCheckOutput = await new Response(
      streamlinkCheck.stdout
    ).json()

    if (streamlinkCheckOutput.streams != null) {
      canPlay = true
    } else {
      canPlay = false
    }
  } catch (error) {
    canPlay = false
  }

  // Build the streamUrl, fileUrl(mp4) and streamFile(m3u8)
  const safeUrl = encodeUrl(originalUrl)
  const streamUrl = `https://api.haishin.io/streams/${safeUrl}/stream.m3u8`

  const folder = path.join(streamsFolder, `/${safeUrl}`)
  const file = `${folder}/stream.mp4`
  const streamFile = `${folder}/index.m3u8`

  const newStream = !fs.existsSync(file)

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
    folder,
    file,
    streamFile
  }
}
