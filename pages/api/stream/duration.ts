import path from 'path'
import probe from 'node-ffprobe'

import * as Sentry from "@sentry/nextjs"

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
    Sentry.captureException(new Error("Could not get a duration"), scope => {
      scope.clear()
      scope.setExtra('streamFile', streamFile)
      return scope
    });

    return res.status(200).json({
      duration: 0
    });
  }

  return res.status(200).json({
    duration: probeData.format.duration
  });
}