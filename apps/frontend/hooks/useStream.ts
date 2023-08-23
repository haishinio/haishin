import useSWR from 'swr'
import type StreamInfo from '../types/StreamInfo'

interface SwrProps {
  data: StreamInfo | StreamInfo[]
  error: any
  isLoading: boolean
}

interface StreamDataResponse {
  data: StreamInfo | StreamInfo[]
  isLoading: boolean
  isError: boolean
}

const fetcher = async (url: string): Promise<any> =>
  await fetch(url).then(async (res) => await res.json())

function useStream(id?: string): StreamDataResponse {
  const { data, error, isLoading }: SwrProps = useSWR(
    id === undefined ? `/api/stream` : `/api/stream/${id}`,
    fetcher,
    {
      refreshInterval: id === undefined ? 60000 : 0
    }
  )

  if (error !== undefined) {
    console.log({ error })
  }

  return {
    data,
    isLoading,
    isError: Boolean(error)
  }
}

export default useStream
