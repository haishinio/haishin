import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { secondsToDuration } from '@haishin/transcriber-utils';
import { splitVideoFile, transcribeTranslatePart } from '@haishin/transcriber';
import { NextResponse } from "next/server";

import type { TextLog } from '../../../types/Textlog';

type Query = {
  fileDuration: number
  streamFile: string
};

export async function POST(request: Request) {
  const query: Query = await request.json();
  const { fileDuration, streamFile } = query;
  const partDuration = 10;
  
  // Get length of file uploaded if available
  const numOfParts = (fileDuration / partDuration);

  const cwd = process.cwd();
  const uploadPath = path.join(cwd, '../..', `${streamFile}`);
  const workerPath = path.join(cwd, '../..', 'packages', 'transcriber', 'dist', 'workers', 'ffmpeg-splitter.js');

  let textLogArray = [] as TextLog[];
  // For every 10s, split the file and send to whisper and then deepl
  for (let i = 0; i < numOfParts; i++) {
    const startTime = partDuration * i;

    const { partFileName } = await splitVideoFile(uploadPath, startTime, partDuration, workerPath);

    const { transcription, translation } = await transcribeTranslatePart(partFileName, textLogArray.at(-1)?.transcription ?? '');

    textLogArray.push({
      id: uuidv4(),
      time: secondsToDuration(startTime),
      transcription,
      translation,
    });
  }

  // Then group the responses and send to the ui
  return NextResponse.json({textLogs: textLogArray}, {status: 200});
}
