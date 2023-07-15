export function getPathsByUrl(url: string) {
  let cleanPath = url
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '');

  if (url.includes('youtube') || url.includes('youtu.be')) {
    cleanPath = cleanPath
      .replace('.com', '')
      .replace('watch', '')
      .replace('?v=', '');
  }

  if (url.includes('twitcasting')) {
    cleanPath = cleanPath
      .replace('.tv', '')
      .replace('c:', '');
  }
    
  if (url.includes('twitch')) {
    cleanPath = cleanPath
      .replace('.tv', '');
  }

  if (url.includes('showroom')) {
    cleanPath = cleanPath
      .replace('showroom-live', 'showroom')
      .replace('.com', '')
      .replace('/r', '');
  }
    
  const paths = cleanPath.split('/');
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