export const encodeUrl = (url: string): string => {
  const encodedUrl = encodeURIComponent(btoa(url))

  return encodedUrl
}

export const decodeUrl = (base64Url: string): string => {
  const decodedUrl = atob(decodeURIComponent(base64Url))

  return decodedUrl
}

export default {
  encodeUrl,
  decodeUrl
}
