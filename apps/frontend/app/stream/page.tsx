import { Suspense } from 'react'
import StreamUrlPage from './client-page'
import Loading from '../../components/loading'

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <StreamUrlPage />
    </Suspense>
  )
}
