import type { SplitVideoFileResponse } from './responses'
declare const splitVideoFile: (
  filename: string,
  startTime: number,
  workerPath?: string,
  duration?: number
) => Promise<SplitVideoFileResponse>
export default splitVideoFile
