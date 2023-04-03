import type { TextLog } from '../types/Textlog'

type Props = {
  textLog: TextLog
}

export default function TextLogRow({ textLog }: Props) {
  return (
    <>
      <td className="p-2 w-8">{textLog.time}</td>
      <td className="p-2 break-words w-full table-cell sm:hidden xl:table-cell">
        <p>{textLog.transcription}</p>
        <p>{textLog.translation}</p>
      </td>
      <td className="p-2 break-words w-1/2 hidden sm:table-cell xl:hidden">{textLog.transcription}</td>
      <td className="p-2 break-words w-1/2 hidden sm:table-cell xl:hidden">{textLog.translation}</td>
    </>
  )
}