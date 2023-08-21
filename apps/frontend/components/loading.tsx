import Spinner from './spinner'

const getRandomElement = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)]

const Loading = ({ message }: { message?: string }): React.JSX.Element => {
  const messages = [
    'Loading...',
    'iWanna Party Night...',
    'Papipupepo...',
    'Check a dempa...'
  ]
  let currentMessage = getRandomElement(messages)

  if (message != null) currentMessage = message

  return (
    <>
      <Spinner />
      <span className='block animate-pulse'>{currentMessage}</span>
    </>
  )
}

export default Loading
