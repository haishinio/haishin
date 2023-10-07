import { NextResponse } from 'next/server'

import type StreamInfo from '../../../../types/StreamInfo'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<StreamInfo>> {
  const { id } = params

  const backendUrl = process.env.BACKEND_URL ?? ''
  const apiUrl = `${backendUrl}/streams/${id}`

  const stream = await fetch(apiUrl).then(
    async (response) => await response.json()
  )

  return NextResponse.json(stream, { status: 200 })
}
