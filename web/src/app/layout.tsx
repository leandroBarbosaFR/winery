import type {Metadata, Viewport} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sommelier — what to pour, right now',
  description: 'Tell us where you are, what time it is and what you are eating. We pick the wine.',
}

export const viewport: Viewport = {
  themeColor: '#1c0b14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gloock&family=Hanken+Grotesk:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
