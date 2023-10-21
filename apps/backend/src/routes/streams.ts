import fs from 'node:fs'
import path from 'node:path'

import { Elysia } from 'elysia'

import { getDuration, getPathsByUrl, urlUtils } from '@haishin/utils'
import { getStreamInfo } from '../utils/get-stream-info'

import { setup } from '../plugins/setup'

export const streamsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'streams'
)
export const streamPartsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'stream-parts'
)

const apiStreamsUrl = `${process.env.BACKEND_URL}/streams`

if (!fs.existsSync(streamsFolder)) {
  fs.mkdirSync(streamsFolder)
}

const streams = new Elysia()
  .use(setup)
  .get('/streams', async ({ store: { redis } }) => {
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

        const viewers = await redis.sCard(`users:${streamUrl}`)

        return {
          id: stream,
          started,
          duration: getDuration(streamInfo.file),
          title,
          thumbnail: `${apiStreamsUrl}/${stream}/stream.jpg`,
          url: streamUrl,
          viewers
        }
      })
    )

    return enhancedStreamData
  })
  .get('/streams/:id', async ({ params: { id }, store: { redis } }) => {
    const streamUrl = urlUtils.decodeUrl(id)

    const streamInfo = await getStreamInfo(streamUrl)
    const paths = getPathsByUrl(streamUrl)
    const title = `${paths.site} - ${paths.user}`

    let started = new Date()
    if (fs.existsSync(streamInfo.file))
      started = fs.statSync(streamInfo.file).birthtime

    const viewers = await redis.sCard(`users:${streamUrl}`)

    const stream = {
      id,
      started,
      duration: getDuration(streamInfo.file),
      title,
      thumbnail: `${apiStreamsUrl}/${id}/stream.jpg`,
      url: streamUrl,
      viewers
    }

    return stream
  })

export default streams
