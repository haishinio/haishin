import { NextResponse } from 'next/server'

import { getDuration, getPathsByUrl, urlUtils } from '@haishin/utils'
import { pathToData } from '../../../utils/path-to-data'

import type StreamInfo from '../../../types/StreamInfo'

export const dynamic = 'force-dynamic'

function isEmpty(obj: object): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }

  return true
}

export async function GET(): Promise<NextResponse<StreamInfo[]>> {
  const rtmpUrl = process.env.NEXT_PUBLIC_RTMP_CLIENT_API_URL ?? ''
  const apiUrl = `${rtmpUrl}streams`

  const baseStreamsObj = await fetch(apiUrl).then(
    async (response) => await response.json()
  )

  if (isEmpty(baseStreamsObj)) {
    return NextResponse.json([], { status: 200 })
  }

  const streamKeys = Object.keys(baseStreamsObj.live)

  const streams = streamKeys.map((stream: string): StreamInfo => {
    const streamData = baseStreamsObj.live[stream]
    const { publisher, subscribers } = streamData
    const viewers = subscribers.length

    const streamUrl = urlUtils.decodeUrl(stream)
    const paths = getPathsByUrl(streamUrl)
    const title = `${paths.site} - ${paths.user}`

    let duration = 0
    const durationStr = getDuration(
      pathToData(`data/live/${stream}/stream.mp4`)
    )
    if (durationStr !== null) {
      duration = Math.floor(parseFloat(durationStr))
    }

    const thumbnail = `${process.env.RTMP_CLIENT_URL ?? ''}${stream}/stream.jpg`

    return {
      id: stream,
      started: publisher.connectCreated,
      duration,
      thumbnail,
      title,
      url: streamUrl,
      viewers
    }
  })

  return NextResponse.json(streams, { status: 200 })
}
