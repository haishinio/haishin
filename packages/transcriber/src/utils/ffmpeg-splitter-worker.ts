import { parentPort } from 'worker_threads';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: false, corePath: '@ffmpeg/core', });

async function run(pathToFile, startTime, durationOfPart) {
  console.log('Loading ffmpeg')
  await ffmpeg.load();
  console.log('Loaded ffmpeg')

  try {
    console.log('Fetching file')
    const input = await fetchFile(pathToFile);
    console.log('Fetched file')
    ffmpeg.FS('writeFile', 'input.mp4', input);
    console.log('Loaded file into memory')
    
    console.log('Starting to split file and convert to wav')
    await ffmpeg.run('-i', 'input.mp4', '-ss', startTime.toString(), '-t', durationOfPart.toString(), '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '1', 'output.wav');
    console.log('Finished splitting file and converted to wav')
    
    console.log('Start reading output file')
    const outputData = ffmpeg.FS('readFile', 'output.wav');
    console.log('Finish reading output file')

    console.log('Sending output data back to main thread')
    parentPort.postMessage({ output: outputData });
  } catch (error) {
    console.log('An error occurred in the worker')
    console.log(error)
    parentPort.postMessage({ error: error.message });
  } finally {
    console.log('Unlinking files to free memory')
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.wav');
    console.log('Done unlinking files to free memory')
    
    console.log('Start closing ffmpeg')
    ffmpeg.exit();
    console.log('Closed ffmpeg');
    parentPort.close();
  }
}

parentPort.on('message', (message) => {
  if (message.command === 'run') {
    run(message.pathToFile, message.startTime, message.durationOfPart);
  }

  if (message.command === 'shutdown') {
    // Clean up resources and exit gracefully
    process.exit(0);
  }
});