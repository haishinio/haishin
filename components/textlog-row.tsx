import type { TextLog } from '../types/Textlog'

type Props = {
  textLog: TextLog
}

export default function TextLogRow({ textLog }: Props) {
  return (
    <>
      <td className="p-2 w-8">{textLog.time}</td>
      <td className="hidden xl:table-cell p-2">
        <p>{textLog.transcription}</p>
        <p>{textLog.translation}</p>
      </td>
      <td className="table-cell xl:hidden p-2">{textLog.transcription}</td>
      <td className="table-cell w-1/2 xl:hidden p-2">{textLog.translation}</td>
    </>
  )
}