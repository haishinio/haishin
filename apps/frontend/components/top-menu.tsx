import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  url: string
}

const TopMenu = (props: Props): JSX.Element => {
  const { url } = props
  const [streamUrl, updateStreamUrl] = useState(url)
  const [cleanStreamUrl, updateCleanStreamUrl] = useState('')

  useEffect(() => {
    if (streamUrl !== '') {
      let cleanUrl = streamUrl

      cleanUrl = btoa(streamUrl)
      updateCleanStreamUrl(cleanUrl)
    }
  }, [streamUrl])

  const onStreamSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    location.assign(`/stream/${cleanStreamUrl}`)
  }

  return (
    <div className='bg-zinc-800 text-white px-2 py-3 flex items-center w-full'>
      <Link
        href={'/'}
        className='font-bold hover:text-zinc-200 transition-colors'
      >
        Back
      </Link>

      <div className='flex-grow'>
        <form onSubmit={onStreamSubmit} className='w-2/3 sm:w-1/2 mx-auto flex'>
          <label className='relative flex-1'>
            <span className='sr-only'>URL</span>
            <input
              className='placeholder:italic placeholder:text-slate-400 block bg-white text-black w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
              placeholder='Stream url'
              type='url'
              name='streamUrl'
              onChange={(e) => {
                updateStreamUrl(e.target.value)
              }}
              value={streamUrl}
            />
          </label>
        </form>
      </div>
    </div>
  )
}

export default TopMenu
