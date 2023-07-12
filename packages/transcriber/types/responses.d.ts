export interface StreamDataResponse {
  newStream: boolean
  port: string
  file: string
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