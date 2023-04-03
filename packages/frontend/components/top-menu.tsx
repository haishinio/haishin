import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Props = {
  url: string
}

const TopMenu = (props: Props) => {
  const { url } = props
  const [ streamUrl, updateStreamUrl ] = useState(url)
  const [ cleanStreamUrl, updateCleanStreamUrl ] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (streamUrl) {
      const cleanUrl = encodeURIComponent(streamUrl)
      updateCleanStreamUrl(cleanUrl)
    }
  }, [streamUrl])

  const clickUploadRef = () => {
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  const onFileUpload = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }

  const onStreamSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    location.assign(`/stream/${cleanStreamUrl}`)
  }

  return (
    <div className="bg-zinc-800 text-white px-2 py-3 flex items-center w-full">
      <Link href={'/'} className="font-bold hover:text-zinc-200 transition-colors">Back</Link>

      <div className="flex-grow">
        <form onSubmit={onStreamSubmit} className="w-2/3 sm:w-1/2 mx-auto flex">
          <label className="relative flex-1">
            <span className="sr-only">URL</span>
            <input className="placeholder:italic placeholder:text-slate-400 block bg-white text-black w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Stream url" type="text" name="streamUrl" onChange={(e) => { updateStreamUrl(e.target.value) }} value={streamUrl} />
          </label>
        </form>
      </div>

      <form action="/api/stream/upload" method="post" encType="multipart/form-data" className="flex" ref={formRef}>
        <input ref={uploadRef} type="file" name="file" hidden onChange={() => onFileUpload} />
        <label className="relative flex-1">
          <span className="sr-only">File</span>
          <input className="font-bold hover:text-zinc-200 transition-colors" type="button" value="Upload" onClick={() => clickUploadRef} />
        </label>
      </form>
    </div>
  )
}

export default TopMenu