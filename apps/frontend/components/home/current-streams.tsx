'use client'

import useSWR from 'swr'
import Link from 'next/link'

const NoStreamsComponent = (): JSX.Element => (
  <div>
    <p>There are no current streams...</p>
  </div>
)

export default function CurrentStreams(): JSX.Element {
  const rtmpUrl = process.env.NEXT_PUBLIC_RTMP_CLIENT_API_URL ?? ''
  const url = `${rtmpUrl}streams`
  const { data, error } = useSWR(
    url,
    async (url: string): Promise<any> =>
      await fetch(url).then(async (res) => await res.json()),
    { refreshInterval: 60000 }
  )

  const fetchError = Boolean(error)

  if (rtmpUrl === '' || data?.live === undefined || fetchError)
    return <NoStreamsComponent />

  const streams = Object.keys(data.live)

  return (
    <>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        {streams.map((stream) => (
          <div key={stream}>
            <Link
              href={`/stream/${stream}`}
              className='transition-all duration-100 text-sky-600 hover:text-sky-500 break-all'
            >
              {atob(stream)}
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
