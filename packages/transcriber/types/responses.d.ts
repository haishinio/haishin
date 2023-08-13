export interface StreamDataResponse {
  canPlay: boolean
  newStream: boolean
  file: string
  baseName: string
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
