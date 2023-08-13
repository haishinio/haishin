'use server'

import fs from 'fs'
import path from 'path'
import { redirect } from 'next/navigation'

const pathToData = (restOfFilePath: string): string => {
  return path.join(process.cwd(), '../../', restOfFilePath)
}

const saveFile = async (file: File): Promise<string> => {
  const servePath = `./data/uploads/${file.name}`
  const destinationPath = pathToData(servePath)
  const data = new Uint8Array(await file.arrayBuffer())
  fs.writeFileSync(destinationPath, data)
  return servePath
}

export async function uploadFile(formData: FormData): Promise<Response> {
  const file = formData.get('file') as File
  const streamUrl = await saveFile(file)

  return redirect(`/stream?url=${streamUrl.replace('./data/', '')}`)
}
