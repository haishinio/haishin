import { Suspense } from 'react'
import StreamUrlPage from './client-page'
import Loading from "../../../components/loading"
 
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <StreamUrlPage />
    </Suspense>
  )
}