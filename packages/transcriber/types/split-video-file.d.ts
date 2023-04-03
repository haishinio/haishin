import { SplitVideoFileResponse } from '../types/responses';
declare const splitVideoFile: (filename: string, startTime: number) => Promise<SplitVideoFileResponse>;
export default splitVideoFile;
