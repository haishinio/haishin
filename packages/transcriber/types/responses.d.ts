import type { Streamlink } from '@dragongoose/streamlink';

export interface StreamDataResponse {
  file: string
  originalUrl: string
  streamUrl: string
}

export interface NewStreamDataResponse {
  file: string
  newStream: boolean
  originalUrl: string
  streamUrl: string
  streamLinkClient?: Streamlink
}

export interface SplitVideoFileResponse {
  partFileName: string
  nextStartTime: number
}

export interface TranscriberResponse {
  transcription: string
  translation: string
}