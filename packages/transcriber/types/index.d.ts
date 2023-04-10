import { SplitVideoFileResponse, StreamDataResponse, TranscriberResponse } from "./responses";

import setupStream from "./setup-stream";
import splitVideoFile from "./split-video-file";
import transcribeTranslatePart from "./transcribe-translate-part";
export { setupStream, splitVideoFile, transcribeTranslatePart };

declare const transcriber: {
    setupStream: (originalUrl: string) => Promise<StreamDataResponse>;
    splitVideoFile: (filename: string, startTime: number, workerPath?: string, duration?: number) => Promise<SplitVideoFileResponse>;
    transcribeTranslatePart: (filename: string, prompt: string) => Promise<TranscriberResponse>;
};
export default transcriber;
