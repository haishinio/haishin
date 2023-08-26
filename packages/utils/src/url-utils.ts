import { base32Encode, base32Decode } from '@ctrl/ts-base32'

export function urlFix(originalUrl: string): string {
  if (originalUrl.includes('youtube.com/live/')) {
    // youtube.com/live/ urls don't work with streamlink, so we need to convert them to youtube.com/watch?v= urls
    const fixedUrl = originalUrl.replace(
      'youtube.com/live/',
      'youtube.com/watch?v='
    )
    return fixedUrl
  } else {
    return originalUrl
  }
}

export const encodeUrl = (url: string): string => {
  const fixedUrl = urlFix(url)
  const bufferedUrl = Buffer.from(fixedUrl)
  const encodedUrl = base32Encode(bufferedUrl)

  return encodedUrl
}

export const decodeUrl = (base32Url: string): string => {
  const decodedUrl = Buffer.from(base32Decode(base32Url)).toString()

  return decodedUrl
}

export default {
  encodeUrl,
  decodeUrl
}
