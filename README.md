## TODOs

- ~~Investigate why twitcasting embeds no longer work~~ When in responsive mode with inspect element
- ~~How to handle when stream is finish? Can /transcribe/live say done?~~ When /transcribe/live returns empty strings for both transcriptions+translations stop calling the endpoint
- How to stop streams when you move away from the page
- Can we not use the best preset so we can save on filesize
- Can we speed up the duration to reduce lag?
- Can we move whisper offline? (ie rather than call openai and the live whisper, we download the model ourselves? whisper-cpp?)
- Deployment?
- Can we pull in comments + gifts from livestreams?
- Can we add auth so you could comment directly from here?