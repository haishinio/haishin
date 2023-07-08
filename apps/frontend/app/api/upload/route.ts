import { NextResponse } from "next/server"
import fs from 'fs'

import path from 'path'

const pathToData = (restOfFilePath: string): string => {
  return path.join(process.cwd(), '../../', restOfFilePath)
}

// Function to save the file
const saveFile = async (file: File) => {
  const servePath = `./data/uploads/${file.name}`
  const destinationPath = pathToData(servePath)
  const data = new Uint8Array(await file.arrayBuffer());
  fs.writeFileSync(destinationPath, data);
  return servePath;
};

export async function POST(request: Request) {
  try {
    const requestFormData = await request.formData();
    const file = requestFormData.get('file') as File;
    const streamUrl = await saveFile(file);

    return NextResponse.redirect(new URL(`/stream?url=${streamUrl.replace('./data/', '')}`, request.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading file' });
  }
}

