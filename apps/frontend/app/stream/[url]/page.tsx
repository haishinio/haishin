import type { Metadata } from 'next'

import StreamUrlPage from './client-page'
import type StreamInfo from '../../../types/StreamInfo'

interface Props {
  params: { url: string }
}

async function getStreamData(streamUrl: string): Promise<StreamInfo> {
  const productionUrl =
    process.env.FRONTEND_URL !== '' || process.env.FRONTEND_URL !== undefined
      ? (process.env.FRONTEND_URL as string)
      : 'http://localhost:3000'

  const apiUrl = `${productionUrl}/api/stream/${streamUrl}`

  const stream = await fetch(apiUrl, { cache: 'no-store' }).then(
    async (res) => await res.json()
  )

  return stream
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stream = await getStreamData(params.url)

  return {
    title: `📝 ${stream.title}`
  }
}

export default async function Page({
  params
}: Props): Promise<React.JSX.Element> {
  const streamData = await getStreamData(params.url)
  const { id, url } = streamData

  return <StreamUrlPage streamId={id} url={url} />
}
