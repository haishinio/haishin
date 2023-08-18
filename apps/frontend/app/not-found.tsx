import useRandomArtistSong from '../hooks/useRandomArtistSong'

export default function NotFound(): JSX.Element {
  const randomArtistSong = useRandomArtistSong()

  return (
    <div className='min-h-screen w-full max-w-screen-md mx-auto text-center flex items-center'>
      <div className='w-full'>
        <h1 className='text-6xl'>
          Haishin
          <small className='block text-3xl'>- 配信 -</small>
        </h1>
        <h2 className='text-xl'>Stream or page not found!!</h2>
        <p>
          Feel free to go{' '}
          <a href='/' className='underline'>
            back to the homepage
          </a>{' '}
          and try again.
        </p>
        <p>
          If you are repeatedly reaching here maybe give{' '}
          <a
            href='https://twitter.com/tomouchuu'
            target='_blank'
            className='underline'
          >
            Thomas
          </a>{' '}
          a buzz to see if there is an issue!
        </p>
        <p className='mt-4'>
          While you are here, how about some{' '}
          <a href={randomArtistSong.url} target='_blank' className='underline'>
            {randomArtistSong.group}
          </a>
          ?
        </p>
      </div>
    </div>
  )
}
