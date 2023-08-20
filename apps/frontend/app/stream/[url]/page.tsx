import { Suspense } from 'react'
import type { Metadata } from 'next'

import StreamUrlPage from './client-page'
import Loading from '../../../components/loading'

interface Props {
  params: { url: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productionUrl =
    process.env.PRODUCTION_URL !== '' ||
    process.env.PRODUCTION_URL !== undefined
      ? (process.env.PRODUCTION_URL as string)
      : 'http://localhost:3000'
  const streamUrl = params.url
  const url = `${productionUrl}/api/stream/${streamUrl}`

  const stream = await fetch(url).then(async (res) => await res.json())

  return {
    title: `📝 ${stream.title as string}`
  }
}

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <StreamUrlPage />
    </Suspense>
  )
}
