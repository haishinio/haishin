'use client';

import useSWR from 'swr';
import Link from "next/link";
 
export default function CurrentStreams() {
  const url = `${process.env.NEXT_PUBLIC_RTMP_CLIENT_API_URL}streams`;
  const { data, error } = useSWR(url, (url: string) => fetch(url).then((res) => res.json()), { refreshInterval: 60000 });

  if (!data?.live || error) return (
    <div>
      <p>There are no current streams...</p>
    </div>
  );

  const streams = Object.keys(data.live);
 
  return (
    <>
      <section className="mt-4 grid grid-flow-col auto-cols-max gap-4">
        {streams.map((stream) => (
          <div key={stream}>
            <Link href={`/stream/${stream}`} className="transition-all duration-100 text-sky-600 hover:text-sky-500">{atob(stream)}</Link>
          </div>
        ))}
      </section>

      <div className="my-8">
        <hr />
        <div className="text-center -mt-3">
          <p className="px-4 bg-white inline-block">OR</p>
        </div>
      </div>
    </>
  )
}