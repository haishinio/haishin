import setupStream from "./setup-stream";
import splitVideoFile from "./split-video-file";
import transcribeTranslatePart from "./transcribe-translate-part";
export { setupStream, splitVideoFile, transcribeTranslatePart };
declare const transcriber: {
    setupStream: (originalUrl: string) => Promise<import("../types/responses").StreamDataResponse>;
    splitVideoFile: (filename: string, startTime: number, workerPath?: string, duration?: number) => Promise<import("../types/responses").SplitVideoFileResponse>;
    transcribeTranslatePart: (filename: string, prompt: string) => Promise<import("../types/responses").TranscriberResponse>;
};
export default transcriber;
