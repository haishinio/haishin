import { useEffect, useState } from 'react'
import { secondsToDuration } from '@haishin/utils/dist/seconds-to-duration'

const Duration = ({
  hasEnded,
  initialDuration
}: {
  hasEnded: boolean
  initialDuration: number
}): React.JSX.Element => {
  const [, setSeconds] = useState(initialDuration)
  const [duration, setDuration] = useState(secondsToDuration(initialDuration))

  // Updates the duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => {
        const newSeconds = seconds + 1
        setDuration(secondsToDuration(newSeconds))
        return newSeconds
      })
    }, 1000)

    if (hasEnded) clearInterval(interval)

    return () => {
      clearInterval(interval)
    }
  }, [hasEnded])

  return (
    <div className='inline-flex items-center align-middle p-[10px] bg-[--media-secondary-color]'>
      {duration}
    </div>
  )
}

export default Duration
