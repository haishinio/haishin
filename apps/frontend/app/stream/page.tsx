import { Suspense } from 'react'
import StreamUrlPage from './client-page'
import Loading from '../../components/loading'

import type { Metadata } from 'next'

interface Props {
  searchParams: { url: string }
}

export async function generateMetadata({
  searchParams
}: Props): Promise<Metadata> {
  const { url } = searchParams

  return {
    title: `📝 Transcribing: ${url}`
  }
}

export default function Page(): React.JSX.Element {
  return (
    <Suspense fallback={<Loading className='h-screen w-screen text-2xl' />}>
      <StreamUrlPage />
    </Suspense>
  )
}
