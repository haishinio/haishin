import Link from "next/link";

async function getData() {
  const url = `${process.env.RTMP_CLIENT_API_URL}streams`;

  const res = await fetch(url, { next: { revalidate: 10 } });
 
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function CurrentStreams() {
  const data = await getData()

  if (!data.live) return (
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