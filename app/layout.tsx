import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liahona Everyday - Book of Mormon Study',
  description: 'Personal study platform for the Book of Mormon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
