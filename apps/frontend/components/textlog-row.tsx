import type { TextLog } from '../types/Textlog'

interface Props {
  textLog: TextLog
}

export default function TextLogRow({ textLog }: Props): React.JSX.Element {
  return (
    <>
      <td className='p-2 w-full table-cell sm:hidden'>
        <p className='text-sm font-bold'>{textLog.time}</p>
        <p className='break-all'>{textLog.transcription}</p>
        <p className='break-words'>{textLog.translation}</p>
      </td>

      <td className='p-2 w-20 hidden sm:table-cell'>{textLog.time}</td>
      <td className='p-2 break-all w-1/2 hidden sm:table-cell xl:hidden'>
        {textLog.transcription}
      </td>
      <td className='p-2 break-words w-1/2 hidden sm:table-cell xl:hidden'>
        {textLog.translation}
      </td>

      <td className='p-2 w-fit hidden xl:table-cell'>
        <p className='break-all w-full'>{textLog.transcription}</p>
        <p className='break-words w-full'>{textLog.translation}</p>
      </td>
    </>
  )
}
