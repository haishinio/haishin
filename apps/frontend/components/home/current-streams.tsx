'use client'

import useSWR from 'swr'
import Link from 'next/link'

import type StreamInfo from '../../types/StreamInfo'

const NoStreamsComponent = (): React.JSX.Element => (
  <div>
    <p>There are no current streams...</p>
  </div>
)

export default function CurrentStreams(): React.JSX.Element {
  const { data: streams, error }: { data: StreamInfo[]; error?: any } = useSWR(
    '/api/stream',
    async (url: string): Promise<any> =>
      await fetch(url).then(async (res) => await res.json()),
    { refreshInterval: 60000 }
  )

  const fetchError = Boolean(error)

  if (streams === undefined || streams.length === 0 || fetchError)
    return <NoStreamsComponent />

  return (
    <>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        {streams.map((stream) => (
          <div key={stream.id}>
            <Link
              href={`/stream/${stream.id}`}
              className='transition-all duration-100 text-sky-600 hover:text-sky-500 break-all'
            >
              {stream.title}
            </Link>
          </div>
        ))}
      </section>

      <div className='my-8'>
        <hr />
        <div className='text-center -mt-3'>
          <p className='px-4 bg-white inline-block'>OR</p>
        </div>
      </div>
    </>
  )
}
