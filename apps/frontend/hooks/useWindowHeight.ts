import { useEffect, useState } from "react"

export function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} = window
  return {
    width,
    height
  }
}

export function useWindowDimension() {
  const defaultDim = {width: 0, height: 0}
  const [windowDimensions, setWindowDimensions] = useState(defaultDim)

  useEffect(() => {
    setWindowDimensions(getWindowDimensions()) // Necessary to make sure dimensions are set upon initial load

    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  return windowDimensions
}

export default useWindowDimension