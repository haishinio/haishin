import fs from "fs"
import formidable, { Files } from "formidable"

import type { File } from "formidable"
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files: Files) {
    const streamUrl = await saveFile(files.file as File)
    return res.redirect(`/stream?url=${streamUrl.replace('./public/', '')}`)
  });
};

const saveFile = async (file: File) => {
  const destinationPath = `./public/uploads/${file.originalFilename}`
  const data = fs.readFileSync(file.filepath)
  fs.writeFileSync(destinationPath, data)
  await fs.unlinkSync(file.filepath)
  return destinationPath;
};