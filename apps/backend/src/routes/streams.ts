import fs from 'node:fs'
import path from 'node:path'

import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

import { getDuration, getPathsByUrl, urlUtils } from '@haishin/utils'
import { getStreamInfo } from '../stream/get-info'

export const streamsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'streams'
)
const apiStreamsUrl = `${process.env.BACKEND_URL}/streams`

if (!fs.existsSync(streamsFolder)) {
  fs.mkdirSync(streamsFolder)
}

const streams = new Elysia()
  .get('/streams', async () => {
    const streams = fs
      .readdirSync(streamsFolder)
      .filter((file) => !file.includes('.'))

    const enhancedStreamData = await Promise.all(
      streams.map(async (stream) => {
        const streamUrl = urlUtils.decodeUrl(stream)

        const streamInfo = await getStreamInfo(streamUrl)
        const paths = getPathsByUrl(streamUrl)
        const title = `${paths.site} - ${paths.user}`

        let started = new Date()
        if (fs.existsSync(streamInfo.file))
          started = fs.statSync(streamInfo.file).birthtime

        return {
          id: stream,
          started,
          duration: getDuration(streamInfo.file),
          title,
          thumbnail: `${apiStreamsUrl}/${stream}/stream.jpg`,
          url: streamUrl,
          viewers: 0
        }
      })
    )

    return enhancedStreamData
  })
  .get('/streams/:id', async ({ params: { id } }) => {
    const streamUrl = urlUtils.decodeUrl(id)

    const streamInfo = await getStreamInfo(streamUrl)
    const paths = getPathsByUrl(streamUrl)
    const title = `${paths.site} - ${paths.user}`

    let started = new Date()
    if (fs.existsSync(streamInfo.file))
      started = fs.statSync(streamInfo.file).birthtime

    const stream = {
      id,
      started,
      duration: getDuration(streamInfo.file),
      title,
      thumbnail: `${apiStreamsUrl}/${id}/stream.jpg`,
      url: streamUrl,
      viewers: 0
    }

    return stream
  })
  .use(
    staticPlugin({
      assets: streamsFolder,
      prefix: '/streams',
      ignorePatterns: ['.gitkeep']
    })
  )

export default streams
