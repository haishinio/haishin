import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Haishin - 配信 -',
    default: 'Page'
  },
  creator: 'Thomas(tomouchuu)',
  metadataBase: new URL(process.env.FRONTEND_URL ?? 'http://localhost:3000')
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
