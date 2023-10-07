import fs from 'node:fs'
import path from 'node:path'

import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

import { getDuration, getPathsByUrl, urlUtils } from '@haishin/utils'

export const streamsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'streams'
)

if (!fs.existsSync(streamsFolder)) {
  fs.mkdirSync(streamsFolder)
}

const streams = new Elysia()
  .get('/streams', () => {
    const streams = fs.readdirSync(streamsFolder)

    const enhancedStreamData = streams.map((stream) => {
      const streamUrl = urlUtils.decodeUrl(stream)
      const paths = getPathsByUrl(streamUrl)
      const title = `${paths.site} - ${paths.user}`

      return {
        id: stream,
        started: new Date(),
        duration: 0,
        title,
        thumbnail: `${streamsFolder}/${stream}/stream.jpg`,
        url: streamUrl,
        viewers: 0
      }
    })

    console.log({ streams, enhancedStreamData })

    return enhancedStreamData
  })
  .use(
    staticPlugin({
      assets: streamsFolder,
      prefix: '/streams',
      ignorePatterns: ['.gitkeep']
    })
  )

export default streams
