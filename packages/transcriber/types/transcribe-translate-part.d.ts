import type { TranscriberResponse } from './responses'
declare const transcribeTranslatePart: (
  filename: string,
  prompt: string
) => Promise<TranscriberResponse>
export default transcribeTranslatePart
