import { useEffect, useState } from 'react'
import { secondsToDuration } from '@haishin/utils'

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
        if (initialDuration > seconds) return initialDuration

        const newSeconds = seconds + 1
        setDuration(secondsToDuration(newSeconds))
        return newSeconds
      })
    }, 1000)

    const reset = (): void => {
      setSeconds(0)
      setDuration(secondsToDuration(0))
      clearInterval(interval)
    }

    if (hasEnded) {
      reset()
    }

    return () => {
      reset()
    }
  }, [hasEnded, initialDuration])

  return (
    <div className='inline-flex items-center align-middle p-[10px] bg-[--media-secondary-color]'>
      <b>Live:</b>&nbsp;{duration}
    </div>
  )
}

export default Duration
