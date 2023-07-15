export function msToSeconds(e: number): number {
  return Math.floor(e / 1000);
}

export function secondsToDuration(e: number): string {
  const h = Math.floor(e / 3600).toString().padStart(2,'0'),
        m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
        s = Math.floor(e % 60).toString().padStart(2,'0');
  return `${h}:${m}:${s}`;
}

export default secondsToDuration;