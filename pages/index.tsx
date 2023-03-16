import type { NextPage } from 'next'

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Home: NextPage = () => {
  const [streamUrl, updateStreamUrl] = useState('')
  const [cleanStreamUrl, updateCleanStreamUrl] = useState('')

  useEffect(() => {
    const cleanUrl = encodeURIComponent(streamUrl)
    updateCleanStreamUrl(cleanUrl)
  }, [streamUrl])

  return (
    <>
      <form className='flex'>
        <label className="relative flex-1">
          <span className="sr-only">URL</span>
          <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Stream url" type="text" name="streamUrl" onChange={(e) => { updateStreamUrl(e.target.value) }}/>
        </label>
        <Link href={`/stream/${cleanStreamUrl}`} className='ml-4 px-8 py-1 text-white rounded bg-sky-600 hover:bg-sky-700'>Submit</Link>
      </form>

      <form action="/api/stream/upload" method="post" encType="multipart/form-data">
        <label className="relative flex-1">
          <span className="sr-only">File</span>
          <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="accessStream" type="file" name="file" />
        </label>
        <button type="submit">Upload</button>
      </form>
    </>
  )
}

export default Home
