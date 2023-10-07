import { NextResponse } from 'next/server'

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
  const backendUrl = process.env.BACKEND_URL ?? ''
  const apiUrl = `${backendUrl}/streams`

  const streams = await fetch(apiUrl).then(
    async (response) => await response.json()
  )

  if (isEmpty(streams)) {
    return NextResponse.json([], { status: 200 })
  }

  return NextResponse.json(streams, { status: 200 })
}
