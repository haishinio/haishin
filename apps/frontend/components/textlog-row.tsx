import type { TextLog } from '../types/Textlog'

type Props = {
  textLog: TextLog
}

export default function TextLogRow({ textLog }: Props) {
  return (
    <>
      <td className="p-2 w-20">{textLog.time}</td>
      <td className="p-2 w-fit table-cell sm:hidden xl:table-cell">
        <p className="break-all w-full">{textLog.transcription}</p>
        <p className="break-words w-full">{textLog.translation}</p>
      </td>
      <td className="p-2 break-all w-1/2 hidden sm:table-cell xl:hidden">{textLog.transcription}</td>
      <td className="p-2 break-words w-1/2 hidden sm:table-cell xl:hidden">{textLog.translation}</td>
    </>
  )
}