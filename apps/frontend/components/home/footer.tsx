function getVersion(): string {
  return process.env.HAISHIN_VERSION ?? 'dev'
}

export default function CurrentStreams(): JSX.Element {
  const version = getVersion()

  return (
    <footer className='mt-auto pt-4 py-2 text-center text-sm'>
      <p className='flex place-content-center'>
        <a
          className='place-self-end'
          href='https://github.com/tomouchuu/haishin'
        >
          Github
        </a>
        <span className='flex-none mx-2'>|</span>
        <span className='place-self-start'>{version.slice(0, 7)}</span>
      </p>
      <p className='text-xs'>
        Built by <a href='https://tomo.uchuu.io'>Thomas(tomouchuu)</a>
      </p>
    </footer>
  )
}
