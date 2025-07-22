import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterHandle?: string;
}

export default function SEOHead({
  title = "Venna Venkata Siva Reddy - Full Stack Developer & Network Security Expert",
  description = "Innovative software engineer specializing in full-stack development, network security, and modern web technologies. Experienced with React, Next.js, Python, PostgreSQL, and cybersecurity solutions.",
  keywords = "full stack developer, software engineer, network security, React, Next.js, Python, PostgreSQL, cybersecurity, web development, Cisco, portfolio",
  ogImage = "/profile-photo.png",
  ogUrl = "https://my-resume-o2do89dyl-sivavennas-projects.vercel.app",
  twitterHandle = "@sivavenna"
}: SEOHeadProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Venna Venkata Siva Reddy",
    "jobTitle": "Software Engineer Trainee",
    "worksFor": {
      "@type": "Organization",
      "name": "Cisco"
    },
    "url": ogUrl,
    "image": ogImage,
    "sameAs": [
      "https://linkedin.com/in/sivavenna",
      "https://github.com/avis-enna"
    ],
    "knowsAbout": [
      "Full Stack Development",
      "Network Security",
      "React",
      "Next.js",
      "Python",
      "PostgreSQL",
      "Cybersecurity"
    ]
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Venna Venkata Siva Reddy" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="theme-color" content="#00f5ff" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Venna Venkata Siva Reddy Portfolio" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content={twitterHandle} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  );
}
