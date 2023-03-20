import path from 'path'
import probe from 'node-ffprobe'

import type { NextApiRequest, NextApiResponse } from 'next'

type Query = {
  streamFile: string
}

type Data = {
  duration: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query: Query = JSON.parse(req.body)
  const { streamFile } = query
  const pathToFile = path.join(".", streamFile)

  probe.sync = true
  const probeData = await probe(pathToFile)

  if (probeData.error) {
    return res.status(200).json({
      duration: 0
    });
  }

  return res.status(200).json({
    duration: probeData.format.duration
  });
}