import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Liahona Everyday - Book of Mormon Study',
  description: 'Your personal Book of Mormon study companion. Organize topics by life roles, discover relevant scriptures, and track your spiritual growth.',
  keywords: ['Book of Mormon', 'LDS', 'scripture study', 'Liahona', 'spiritual growth', 'faith'],
  authors: [{ name: 'Liahona Everyday' }],
  openGraph: {
    title: 'Liahona Everyday - Book of Mormon Study',
    description: 'Your personal Book of Mormon study companion',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
