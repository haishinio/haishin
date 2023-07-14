export function getPathsByUrl(url: string) {
  const paths = url
    .replace('http://', '')
    .replace('https://', '')
    .replace('.com', '')
    .replace('.tv', '')
    .replace('c:', '')
    .split('/')
  const site = paths.shift()
  
  return {
    site, 
    user: paths.join('-')
  }
}

export function setFileName(url: string): string {
  const paths = getPathsByUrl(url);
  const path = `${paths.site}--${paths.user}`;
  return path;
}

export default setFileName;
