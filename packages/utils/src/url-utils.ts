import { base32Encode, base32Decode } from '@ctrl/ts-base32'

export const encodeUrl = (url: string): string => {
  const bufferedUrl = Buffer.from(url)
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
