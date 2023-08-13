export function isRtmpSite(url: string): boolean {
  return url.includes('showroom') || url.includes('twitcasting')
}

export default isRtmpSite
