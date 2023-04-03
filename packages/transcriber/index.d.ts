declare module "@haishin/transcriber" {
  // Types inside here
  interface SplitVideoFileResponse {
    partFileName: string
    nextStartTime: number
  }

  interface TranscriberResponse {
    transcription: string
    translation: string
  }

  export function splitVideoFile(filename: string, startTime: number): Promise<SplitVideoFileResponse>
  export function transcribeTranslatePart(filename: string, prompt: string): Promise<TranscriberResponse>
}