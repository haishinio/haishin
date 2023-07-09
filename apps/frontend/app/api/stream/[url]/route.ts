import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

const pathToData = (restOfFilePath: string): string => {
  return path.join(process.cwd(), '../../', restOfFilePath)
}

export async function GET(request: Request, { params }: { params: { url: string } }) {
  const { url } = params;
  const filePath = pathToData(`./data/${url}`); // Set file path
  const videoSize = fs.statSync(filePath).size;

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const range = request.headers.get('Range');
    const CHUNK_SIZE = 10 ** 6;

    if (range) {
      console.log({ range, videoSize });

      const [start, end] = range.replace(/bytes=/, '').split('-');
      const startByte = parseInt(start);
      const endByte = end ? parseInt(end) : Math.min(startByte + CHUNK_SIZE, videoSize - 1);
      const chunkSize = (endByte - startByte) + 1;

      console.log({ startByte, endByte, chunkSize });

      const stream = fs.createReadStream(filePath, { start: startByte, end: endByte });

      const headers = new Headers();
      headers.set('Content-Range', `bytes ${startByte}-${endByte}/${videoSize}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', chunkSize.toString());
      headers.set('Content-Type', 'video/mp4');
      headers.set('Cache-Control', 'no-cache');
      headers.set('Connection', 'keep-alive');

      return new NextResponse(stream, { headers, status: 206 });
    }

    console.log('No range');
    const stream = fs.createReadStream(filePath);
    return new NextResponse(stream, { headers: { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' }, status: 200 });
  } else {
    return new NextResponse(null, { status: 404 });
  }
}