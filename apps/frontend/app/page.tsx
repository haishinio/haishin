/* eslint-disable @typescript-eslint/no-misused-promises */
// import { uploadFile } from './upload-action'

import Alert from '../components/alert'
import HomeLivestreamForm from '../components/home/livestream-form'
import CurrentStreams from '../components/home/current-streams'
import Footer from '../components/home/footer'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haishin - 配信 -',
  description:
    "Haishin is a transcriber+translator service for livestreams powered by openai's whisper and deepL's translations."
}

export default function Page(): React.JSX.Element {
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <section>
          <h1 className='text-4xl'>
            Haishin
            <small className='block text-xl'>- 配信 -</small>
          </h1>

          <p>
            This tool is able to take a stream url and then transcribe what was
            said in Japanese and then translate it into English. It does this by
            splitting the file or stream into chunks and sends these to
            OpenAI&apos;s whisper model for transcribing and then it sends this
            transcription to DeepL for translation.
          </p>
          <p className='my-2'>
            Presently you&apos;ll get a new a new transcription and translation
            every few seconds for a livestream.
          </p>
          <p>
            The tool is not perfect, transcriptions may miss or make mistakes
            which causes a knock on effect for translations. But it should be
            good enough for English speakers to understand the gist of streams.
          </p>

          <Alert />

          <div className='hidden lg:block'>
            <Footer />
          </div>
        </section>

        <section className='current-streams'>
          <h3 className='text-2xl'>Current livestreams</h3>

          <CurrentStreams />

          <section>
            <p>Add a livestream to haishin by entering it below</p>
            <HomeLivestreamForm />
            <div className='text-center'>
              <p>
                Currently known supported sites: <i>Youtube</i>, <i>Twitch</i>,{' '}
                <i>Showroom</i> and <i>Twitcasting</i>.
              </p>
              <p>
                Anything supporting{' '}
                <a className='underline' href='https://streamlink.github.io/'>
                  Streamlink
                </a>{' '}
                <i>should</i> work
              </p>
            </div>
          </section>
        </section>

        <div className='block lg:hidden'>
          <Footer />
        </div>
      </div>
    </div>
  )
}
