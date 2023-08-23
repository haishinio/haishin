import Spinner from './spinner'

const getRandomElement = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)]

const Loading = ({
  className = '',
  message
}: {
  className?: string
  message?: string
}): React.JSX.Element => {
  const messages = [
    'Loading...',
    'iWanna Party Night...',
    'Papipupepo...',
    'Check a dempa...'
  ]
  let currentMessage = getRandomElement(messages)

  if (message != null) currentMessage = message

  return (
    <div
      className={`flex content-center items-center mx-auto text-center ${className}`}
    >
      <div className='w-full'>
        <Spinner />
        <span className='block animate-pulse'>{currentMessage}</span>
      </div>
    </div>
  )
}

export default Loading
