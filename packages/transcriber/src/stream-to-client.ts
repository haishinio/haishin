import fs from 'fs';
import { spawn } from 'child_process';

export function streamToUI(filename: string, streamKey: string) {
  // Circular buffer configuration
  const bufferSize = 8192; // Buffer size in bytes
  const bufferMaxChunks = 10; // Maximum number of chunks to store in the buffer

  // Create the circular buffer
  const buffer = [];
  let bufferStart = 0; // Index of the oldest chunk in the buffer
  let bufferEnd = 0; // Index of the next available position in the buffer

  // Create a readable stream from the video file
  const readStream = fs.createReadStream(filename, { highWaterMark: bufferSize });
  readStream.on('data', (chunk) => {
    buffer[bufferEnd] = chunk;
    bufferEnd = (bufferEnd + 1) % bufferMaxChunks;

    if (bufferEnd === bufferStart) {
      // Buffer is full, overwrite the oldest chunk
      bufferStart = (bufferStart + 1) % bufferMaxChunks;
    }
  });

  // Create the FFmpeg child process
  const ffmpegCommand = [
    '-re',
    '-i', 'pipe:0', // Read from stdin
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-tune', 'zerolatency',
    '-c:a', 'aac',
    '-ar', '44100',
    '-f', 'flv',
    `rtmp://localhost/live/${streamKey}`
  ];
  const ffmpegProcess = spawn('ffmpeg', ffmpegCommand);

  // Process the data from the circular buffer and send it to the FFmpeg process
  function processBuffer() {
    console.log({ bufferStart, bufferEnd, buffer });

    if (bufferStart !== bufferEnd) {
      const chunk = buffer[bufferStart];
      bufferStart = (bufferStart + 1) % bufferMaxChunks;
      ffmpegProcess.stdin.write(chunk, () => {
        processBuffer(); // Process the next chunk
      });
    } else {
      // Buffer is empty, end the FFmpeg process stdin stream
      console.log('Buffer is empty, ending FFmpeg process stdin stream');
      ffmpegProcess.stdin.end();
    }
  }

  // Start processing the circular buffer
  readStream.on('end', () => {
    processBuffer();
  });

  // Log FFmpeg output
  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  // Log FFmpeg error output
  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  // Handle FFmpeg process exit
  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
}

export default streamToUI;
