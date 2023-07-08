import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

const pathToData = (restOfFilePath: string): string => {
  return path.join(process.cwd(), '../../', restOfFilePath)
}

export async function GET(request: Request, { params }: { params: { url: string } }) {
  const { url } = params;
  console.log({url});
  const filePath = pathToData(`./data/${url}`); // Set file path

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set headers to force file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${url}"`);

    // Read the file and send it as the response
    const stream = fs.createReadStream(filePath);
    return new NextResponse(stream, { headers });
  } else {
    return new NextResponse(null, { status: 404 });
  }
}