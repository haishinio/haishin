import { NextResponse } from 'next/server'

import { getPathsByUrl, urlUtils } from '@haishin/utils'

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

  const { duration, startTime: started, viewers } = baseStreamObj

  const streamUrl = urlUtils.decodeUrl(id)
  const paths = getPathsByUrl(streamUrl)
  const title = `${paths.site} - ${paths.user}`

  const stream = {
    id,
    started,
    duration,
    thumbnail: '',
    title,
    url: streamUrl,
    viewers
  }

  return NextResponse.json(stream, { status: 200 })
}
