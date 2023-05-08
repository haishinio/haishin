import '../styles/globals.css'
import Script from 'next/script';

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* @ts-ignore */}
      <Script src='https://unpkg.com/vconsole@latest/dist/vconsole.min.js' onLoad={() => { const vConsole = new window.VConsole() }} />
    </>
  )
}

export default MyApp
