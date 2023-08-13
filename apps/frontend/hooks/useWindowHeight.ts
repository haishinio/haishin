'use client'

import { useEffect, useState } from 'react'

export function getWindowDimensions(): { width: number; height: number } {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

export function useWindowDimension(): { width: number; height: number } {
  const defaultDim = { width: 0, height: 0 }
  const [windowDimensions, setWindowDimensions] = useState(defaultDim)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setWindowDimensions(getWindowDimensions()) // Necessary to make sure dimensions are set upon initial load

    function handleResize(): void {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowDimensions
}

export default useWindowDimension
