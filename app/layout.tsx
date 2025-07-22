import './globals.css'
import type { Metadata, Viewport } from 'next'
import PerformanceMonitor from './components/PerformanceMonitor'

export const metadata: Metadata = {
  title: 'Venna Venkata Siva Reddy - Full Stack Developer & Network Security Expert',
  description: 'Innovative software engineer specializing in full-stack development, network security, and modern web technologies. Experienced with React, Next.js, Python, PostgreSQL, and cybersecurity solutions.',
  keywords: ['full stack developer', 'software engineer', 'network security', 'React', 'Next.js', 'Python', 'PostgreSQL', 'cybersecurity', 'web development', 'Cisco', 'portfolio'],
  authors: [{ name: 'Venna Venkata Siva Reddy' }],
  openGraph: {
    title: 'Venna Venkata Siva Reddy - Full Stack Developer',
    description: 'Innovative software engineer specializing in full-stack development and network security',
    url: 'https://my-resume-o2do89dyl-sivavennas-projects.vercel.app',
    siteName: 'Venna Venkata Siva Reddy Portfolio',
    images: [
      {
        url: '/profile-photo.png',
        width: 1200,
        height: 630,
        alt: 'Venna Venkata Siva Reddy - Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venna Venkata Siva Reddy - Full Stack Developer',
    description: 'Innovative software engineer specializing in full-stack development and network security',
    images: ['/profile-photo.png'],
    creator: '@sivavenna',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00f5ff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <PerformanceMonitor />
      </body>
    </html>
  )
}
