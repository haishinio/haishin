import fs from 'fs'
import { NextResponse } from 'next/server'
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer'

import pathToData from '../../../../utils/path-to-data'

export async function GET(
  request: Request,
  { params }: { params: { url: string } }
): Promise<NextResponse> {
  const { url } = params

  const filePath = pathToData(`./data/${url}`) // Set file path
  const videoSize = fs.statSync(filePath).size

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const range = request.headers.get('Range')
    const CHUNK_SIZE = 10 ** 6

    const headers = new Headers()
    headers.set('Content-Type', 'video/mp4')

    if (range != null) {
      const [start, end] = range.replace(/bytes=/, '').split('-')

      let startByte = parseInt(start)
      const endByte =
        end !== ''
          ? parseInt(end)
          : Math.min(startByte + CHUNK_SIZE, videoSize - 1)
      if (startByte > endByte) startByte = 0

      const chunkSize = endByte - startByte + 1

      const stream = await streamToBuffer(
        fs.createReadStream(filePath, { start: startByte, end: endByte })
      )

      headers.set('Content-Range', `bytes ${startByte}-${endByte}/${videoSize}`)
      headers.set('Accept-Ranges', 'bytes')
      headers.set('Content-Length', chunkSize.toString())
      headers.set('Cache-Control', 'no-cache')
      headers.set('Connection', 'keep-alive')

      return new NextResponse(stream, { headers, status: 206 })
    }

    const stream = await streamToBuffer(fs.createReadStream(filePath))

    headers.set('Content-Length', videoSize.toString())

    return new NextResponse(stream, { headers, status: 200 })
  } else {
    return new NextResponse(null, { status: 404 })
  }
}
