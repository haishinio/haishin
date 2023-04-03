export interface StreamDataResponse {
  file: string
  newStream: boolean
  originalUrl: string
  streamUrl: string
}

export interface SplitVideoFileResponse {
  partFileName: string
  nextStartTime: number
}

export interface TranscriberResponse {
  transcription: string
  translation: string
}