# Haishin 配信

This website is able to take a stream url or an mp4 file and then transcribe what was said in Japanese and then translate it into English. It does this by splitting the file or stream into chunks and sends these to OpenAI's whisper model for transcribing and then it sends this transcription to DeepL for translation. Presently it'll send a request at least every 5 seconds to get the latest things that were said.

It's certainly not perfect but hopefully it's enough for English speakers to understand the context around streams.

## In Progress
- Deployment, probably going to use Dockerfile so please wait for now!

## TODOs

- Can we not use the best preset so we can save on filesize
- Can we pull in comments + gifts from livestreams?
- Can we add auth so you could comment directly from here?

## Local Use

1. You'll need [nodejs](https://nodejs.org/en), [ffmpeg](https://ffmpeg.org/download.html), [streamlink](https://streamlink.github.io/install.html) to be available in your command line and api keys for [OpenAi](https://platform.openai.com/) + [DeepL](https://www.deepl.com/pro-api).
2. Download/clone the repo, navigate to it in your command line and run `npm i` to install more dependencies.
3. Copy `.env.example` to `.env` and fill it out with your OpenAi and DeepL api keys.
4. Now you should be able to run `npm run dev` to start the dev server which is enough to get started. Once started you should be able to go to http://localhost:3000 to see the site.

OpenAI gives you $5 to use for the first few months after signing up. I _think_ you can just keep creating accounts to get more. You'll be spending $0.006 a minute with OpenAI so a 1 hour stream will cost you ~$0.36 meaning you can watch just under 14 hours of streams with the free $5 you are given.

DeepL has a free allowance of 500,000 characters a month. It seems plenty fine!

If developing you might want to use `npm run dev:faker` instead so you don't use your OpenAI or DeepL tokens.
