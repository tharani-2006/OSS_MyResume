import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'profile' | 'article'
  section?: string
}

const defaultSEO = {
  title: 'Venna Venkata Siva Reddy - Backend Developer & Cybersecurity Specialist',
  description: 'Experienced Backend Developer and Cybersecurity Specialist from Bengaluru, India. Expert in Node.js, Python, PostgreSQL, React, and network security.',
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
    'secure coding'
  ],
  image: '/profile-photo.png',
  url: 'https://my-resume-o2do89dyl-sivavennas-projects.vercel.app',
  type: 'profile' as const,
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  section
}: SEOProps = {}): Metadata {
  const seoTitle = title ? `${title} | ${defaultSEO.title}` : defaultSEO.title
  const seoDescription = description || defaultSEO.description
  const seoKeywords = [...defaultSEO.keywords, ...keywords]
  const seoImage = image || defaultSEO.image
  const seoUrl = url || (section ? `${defaultSEO.url}/#${section}` : defaultSEO.url)

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: 'Venna Venkata Siva Reddy', url: defaultSEO.url }],
    creator: 'Venna Venkata Siva Reddy',
    publisher: 'Venna Venkata Siva Reddy',
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: 'Venna Venkata Siva Reddy - Professional Portfolio',
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
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
  }
}

export function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${defaultSEO.url}/#person`,
        "name": "Venna Venkata Siva Reddy",
        "jobTitle": "Backend Developer & Cybersecurity Specialist",
        "description": defaultSEO.description,
        "url": defaultSEO.url,
        "image": {
          "@type": "ImageObject",
          "url": `${defaultSEO.url}${defaultSEO.image}`,
          "width": 400,
          "height": 400
        },
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
      },
      {
        "@type": "WebSite",
        "@id": `${defaultSEO.url}/#website`,
        "url": defaultSEO.url,
        "name": "Venna Venkata Siva Reddy - Professional Portfolio",
        "description": defaultSEO.description,
        "publisher": {
          "@id": `${defaultSEO.url}/#person`
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "WebPage",
        "@id": `${defaultSEO.url}/#webpage`,
        "url": defaultSEO.url,
        "name": defaultSEO.title,
        "isPartOf": {
          "@id": `${defaultSEO.url}/#website`
        },
        "about": {
          "@id": `${defaultSEO.url}/#person`
        },
        "description": defaultSEO.description,
        "inLanguage": "en-US"
      }
    ]
  }
}

// Breadcrumb structured data for navigation
export function generateBreadcrumbData(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
