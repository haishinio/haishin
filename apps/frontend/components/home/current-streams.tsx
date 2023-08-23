'use client'

import Link from 'next/link'
import useStream from '../../hooks/useStream'

import type StreamInfo from '../../types/StreamInfo'
import Loading from '../loading'

const NoStreamsComponent = (): React.JSX.Element => (
  <div>
    <p>There are no current streams...</p>
  </div>
)

export default function CurrentStreams(): React.JSX.Element {
  const { data, isError, isLoading } = useStream()

  if (isLoading) return <Loading message='Getting streams...' />

  const streams = data as StreamInfo[]

  if (streams === undefined || streams.length === 0 || isError)
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
