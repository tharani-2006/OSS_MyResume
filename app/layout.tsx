import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Venna Venkata Siva Reddy - Backend Developer',
  description: 'Backend Developer & Cybersecurity Enthusiast - Specialized in secure, scalable server-side solutions',
  keywords: ['backend developer', 'cybersecurity', 'nodejs', 'python', 'aws', 'database', 'api development'],
  authors: [{ name: 'Venna Venkata Siva Reddy' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
