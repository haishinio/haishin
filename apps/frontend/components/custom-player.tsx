import React, { useEffect, useRef, useState } from 'react';

function CustomPlayer({ videoChunk }) {
  const [mediaSource, setMediaSource] = useState(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  // const mediaSourceRef = useRef(null);
  // const sourceBufferRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (window.MediaSource) {
      const mediaSourceSetup = new MediaSource();
      setMediaSource(mediaSourceSetup);

      videoRef.current.src = URL.createObjectURL(mediaSourceSetup);

      mediaSourceSetup.addEventListener('sourceopen', () => {
        console.log({ mediaSourceSetup });

        const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        setSourceBuffer(mediaSourceSetup.addSourceBuffer(mimeCodec));
      });
    } else {
      console.error('MediaSource API not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    console.log({ videoChunk });

    if (!videoChunk || !mediaSource || !sourceBuffer) return;

    console.log({ mediaSource, sourceBuffer });

    // sourceBuffer.addEventListener('updateend', () => {
    //   if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
    //     mediaSource.endOfStream();
    //   }
    // });

    sourceBuffer.appendBuffer(videoChunk);
  }, [mediaSource, sourceBuffer, videoChunk])

  return (
    <div>
      <video ref={videoRef} controls />
    </div>
  );
}

export default CustomPlayer;
