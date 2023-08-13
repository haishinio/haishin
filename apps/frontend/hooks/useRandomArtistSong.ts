interface ArtistSong {
  group: string
  url: string
}

const getRandomElement = (array: ArtistSong[]): ArtistSong =>
  array[Math.floor(Math.random() * array.length)]

export function useRandomArtistSong(): ArtistSong {
  const randomArtistSong = getRandomElement([
    { group: 'iWannaDay', url: 'https://www.youtube.com/watch?v=Rdr29nn2brs' },
    { group: 'Papimuzu', url: 'https://www.youtube.com/watch?v=f6hbUZxnkTU' },
    { group: 'Amesola', url: 'https://www.youtube.com/watch?v=z_-tJbK8Bsk' }
  ])

  return randomArtistSong
}

export default useRandomArtistSong
