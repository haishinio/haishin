# Haishin 配信

This website is able to take a stream url or an mp4 file and then transcribe what was said in Japanese and then translate it into English. It does this by splitting the file or stream into chunks and sends these to OpenAI's whisper model for transcribing and then it sends this transcription to DeepL for translation. Presently it'll send a request at least every 5 seconds to get the latest things that were said.

It's certainly not perfect but hopefully it's enough for English speakers to understand the context around streams.

## TODOs

- Deployment?
- Can we not use the best preset so we can save on filesize
- Can we pull in comments + gifts from livestreams?
- Can we add auth so you could comment directly from here?

## Local Use

1. You'll need [nodejs](https://nodejs.org/en), [ffmpeg](https://ffmpeg.org/download.html), [streamlink](https://streamlink.github.io/install.html) and api keys for OpenAi and DeepL.
2. Download/clone the repo, navigate to it in your command line and run `npm i` to install more dependencies.
3. Copy `.env.example` to `.env` and fill it out with your OpenAi and DeepL api keys.
4. Now you should be able to run `npm run dev` to start the dev server which is enough to get started. Once started you should be able to go to http://localhost:3000 to see the site.

If developing you might want to use `npm run dev:faker` instead so you don't use your OpenAI or DeepL tokens.
