import { NextResponse } from 'next/server'

import { getPathsByUrl, urlUtils } from '@haishin/utils'

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

  const streams = streamKeys.map((stream: string) => {
    const streamData = baseStreamsObj.live[stream]
    const { publisher, subscribers } = streamData
    const viewers = subscribers.length

    const streamUrl = urlUtils.decodeUrl(stream)
    const paths = getPathsByUrl(streamUrl)
    const title = `${paths.site} - ${paths.user}`

    const thumbnail = `${process.env.RTMP_CLIENT_URL ?? ''}${stream}/stream.jpg`

    return {
      id: stream,
      started: publisher.connectCreated,
      duration: Math.ceil(
        (Date.now() - Date.parse(publisher.connectCreated)) / 1000
      ),
      thumbnail,
      title,
      url: streamUrl,
      viewers
    }
  })

  return NextResponse.json(streams, { status: 200 })
}
