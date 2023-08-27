'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { urlUtils } from '@haishin/utils/dist/url-utils'

const HomeLivestreamForm = (): React.JSX.Element => {
  const [streamUrl, updateStreamUrl] = useState('')
  const [cleanStreamUrl, updateCleanStreamUrl] = useState('')

  useEffect(() => {
    if (streamUrl !== '') {
      const cleanUrl = urlUtils.encodeUrl(streamUrl)
      updateCleanStreamUrl(cleanUrl)
    }
  }, [streamUrl])

  return (
    <form className='flex my-4'>
      <label className='relative flex-1'>
        <span className='sr-only'>URL</span>
        <input
          className='placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
          placeholder='Stream url'
          type='url'
          name='streamUrl'
          onChange={(e) => {
            updateStreamUrl(e.target.value)
          }}
        />
      </label>
      <Link
        href={`/stream/${cleanStreamUrl}`}
        className='ml-4 px-8 py-2 text-white rounded bg-sky-600 hover:bg-sky-700'
      >
        Submit
      </Link>
    </form>
  )
}

export default HomeLivestreamForm
