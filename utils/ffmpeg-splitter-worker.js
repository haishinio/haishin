const { parentPort } = require('worker_threads');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({ log: false, corePath: '@ffmpeg/core', });

async function run(pathToFile, startTime, durationOfPart) {
  await ffmpeg.load();

  try {
    const input = await fetchFile(pathToFile);
    ffmpeg.FS('writeFile', 'input.mp4', input);

    await ffmpeg.run('-i', 'input.mp4', '-ss', startTime.toString(), '-t', durationOfPart.toString(), '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '1', 'output.wav');

    const outputData = ffmpeg.FS('readFile', 'output.wav');

    parentPort.postMessage({ output: outputData });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  } finally {
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.wav');
    await ffmpeg.exit();
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