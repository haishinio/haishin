# Haishin 配信

[![Deployments](https://github.com/tomouchuu/haishin/actions/workflows/deployments.yml/badge.svg)](https://github.com/tomouchuu/haishin/actions/workflows/deployments.yml)

This website is able to take a stream url or an mp4 file and then transcribe what was said in Japanese and then translate it into English. It does this by splitting the file or stream into chunks and sends these to OpenAI's whisper model for transcribing and then it sends this transcription to DeepL for translation. Presently it'll send a request at every few seconds to get the latest things that were said after an initial short buffer period.

It's certainly not perfect but hopefully it's enough for English speakers to understand the context around streams.

## Current Status

Currently with beta testers so please wait for now, if you'd like to give it a try message me on twitter or something! Probably will be waiting for [#20](https://github.com/tomouchuu/haishin/issues/20) until I post the link publicly incase of api abuse.

## Local Use

1. You'll need [bun](https://bun.sh/), [ffmpeg](https://ffmpeg.org/download.html) and [streamlink](https://streamlink.github.io/install.html) to be available in your command line.
2. Also setup a redis server somewhere and grab the connection url for it. I like railway!
3. Next grab API keys for [OpenAi](https://platform.openai.com/) + [DeepL](https://www.deepl.com/pro-api). Then clone the repo to your local machine and once downloaded, copy `.env.example` to `.env` filling it out with your OpenAi+DeepL api keys and redis url from step 2.
4. Run `bun imstall` within the repo folder to install more dependencies.
5. Now you should be able to run `bun run faker` to start the dev servers which is enough to get started. Once started you should be able to go to http://localhost:3000 to see the site.
6. If you wish to run the site with actual transcriptions and translations then run `bun run dev`.

OpenAI gives you $5 to use for the first few months after signing up. I _think_ you can just keep creating accounts to get more. You'll be spending $0.006 a minute with OpenAI so a 1 hour stream will cost you ~$0.36 meaning you can watch just under 14 hours of streams with the free $5 you are given.

DeepL has a free allowance of 500,000 characters a month. It seems plenty fine!
