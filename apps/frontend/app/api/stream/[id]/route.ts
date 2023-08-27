import { NextResponse } from 'next/server'

import { getDuration, getPathsByUrl, urlUtils } from '@haishin/utils'
import { pathToData } from '../../../../utils/path-to-data'

import type StreamInfo from '../../../../types/StreamInfo'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<StreamInfo>> {
  const { id } = params

  const rtmpUrl = process.env.NEXT_PUBLIC_RTMP_CLIENT_API_URL ?? ''
  const apiUrl = `${rtmpUrl}streams/live/${id}`

  const baseStreamObj = await fetch(apiUrl).then(
    async (response) => await response.json()
  )

  const { startTime: started, viewers } = baseStreamObj

  const streamUrl = urlUtils.decodeUrl(id)
  const paths = getPathsByUrl(streamUrl)
  const title = `${paths.site} - ${paths.user}`

  let duration = 0
  const durationStr = getDuration(pathToData(`data/live/${id}/stream.mp4`))
  if (durationStr !== null) {
    duration = Math.floor(parseFloat(durationStr))
  }

  const thumbnail = `${process.env.RTMP_CLIENT_URL ?? ''}${id}/stream.jpg`

  const stream = {
    id,
    started,
    duration,
    thumbnail,
    title,
    url: streamUrl,
    viewers
  }

  return NextResponse.json(stream, { status: 200 })
}
