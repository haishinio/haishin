RESOURCES:
  - https://blog.logrocket.com/build-video-streaming-server-node/ to send the stream to the videoJS with the /api/start
  - https://videojs.com/guides/live/

## Next steps

- Rather than embedding twitcasting let's try to use videoJS to play the mp4 file we are currently archiving
- Once above is done we should be able to reuse that to power the file upload (mp4 only) -> call /api/transcribe/archive
- Styling
- Deployment?
- Can we overlay the last transcription + translation over stream?
- Can we pull in comments + gifts from livestreams?
- Can we add auth so you could comment directly from here?