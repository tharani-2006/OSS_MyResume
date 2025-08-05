import './globals.css'
import type { Metadata, Viewport } from 'next'
import PerformanceMonitor from './components/PerformanceMonitor'
import { SecurityProvider } from './components/SecurityProvider'
import SecurityMonitor from './components/SecurityMonitor'

export const metadata: Metadata = {
  metadataBase: new URL('https://my-resume-o2do89dyl-sivavennas-projects.vercel.app'),
  title: 'Venna Venkata Siva Reddy - Backend Developer & Cybersecurity Specialist | Bengaluru',
  description: 'Experienced Backend Developer and Cybersecurity Specialist from Bengaluru, India. Expert in Node.js, Python, PostgreSQL, React, and network security. Available for full-time opportunities and freelance projects.',
  keywords: [
    'backend developer',
    'cybersecurity specialist',
    'software engineer',
    'Node.js developer',
    'Python developer',
    'PostgreSQL expert',
    'React developer',
    'full stack developer',
    'network security',
    'Bengaluru developer',
    'India software engineer',
    'web development',
    'API development',
    'database design',
    'secure coding',
    'portfolio'
  ],
  authors: [{ name: 'Venna Venkata Siva Reddy', url: 'https://my-resume-o2do89dyl-sivavennas-projects.vercel.app' }],
  creator: 'Venna Venkata Siva Reddy',
  publisher: 'Venna Venkata Siva Reddy',
  category: 'Technology',
  openGraph: {
    title: 'Venna Venkata Siva Reddy - Backend Developer & Cybersecurity Specialist',
    description: 'Experienced Backend Developer and Cybersecurity Specialist from Bengaluru, India. Expert in Node.js, Python, PostgreSQL, and network security.',
    url: 'https://my-resume-o2do89dyl-sivavennas-projects.vercel.app',
    siteName: 'Venna Venkata Siva Reddy - Professional Portfolio',
    images: [
      {
        url: '/profile-photo.png',
        width: 1200,
        height: 630,
        alt: 'Venna Venkata Siva Reddy - Backend Developer and Cybersecurity Specialist',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venna Venkata Siva Reddy - Backend Developer & Cybersecurity Specialist',
    description: 'Experienced Backend Developer and Cybersecurity Specialist from Bengaluru, India. Expert in Node.js, Python, PostgreSQL, and network security.',
    images: ['/profile-photo.png'],
    creator: '@sivavenna',
    site: '@sivavenna',
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
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Venna Venkata Siva Reddy",
    "jobTitle": "Backend Developer & Cybersecurity Specialist",
    "description": "Experienced Backend Developer and Cybersecurity Specialist specializing in Node.js, Python, PostgreSQL, and network security solutions.",
    "url": "https://my-resume-o2do89dyl-sivavennas-projects.vercel.app",
    "image": "https://my-resume-o2do89dyl-sivavennas-projects.vercel.app/profile-photo.png",
    "email": "vsivareddy.venna@gmail.com",
    "telephone": "+91-93989-61541",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://linkedin.com/in/sivavenna",
      "https://github.com/avis-enna"
    ],
    "knowsAbout": [
      "Backend Development",
      "Cybersecurity",
      "Node.js",
      "Python",
      "PostgreSQL",
      "React",
      "Network Security",
      "API Development",
      "Database Design",
      "Web Development"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Developer"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="overflow-x-hidden">
        <SecurityProvider>
          {children}
          <PerformanceMonitor />
          <SecurityMonitor />
        </SecurityProvider>
      </body>
    </html>
  )
}
