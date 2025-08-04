'use client'

import { useEffect } from 'react'

interface SEOComponentProps {
  structuredData?: object
  breadcrumbs?: Array<{name: string, url: string}>
}

export default function SEOComponent({ structuredData, breadcrumbs }: SEOComponentProps) {
  useEffect(() => {
    // Add structured data to the page
    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      script.id = 'structured-data'
      
      // Remove existing structured data script if present
      const existingScript = document.getElementById('structured-data')
      if (existingScript) {
        existingScript.remove()
      }
      
      document.head.appendChild(script)
      
      // Cleanup on unmount
      return () => {
        const scriptToRemove = document.getElementById('structured-data')
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      }
    }
  }, [structuredData])

  useEffect(() => {
    // Add breadcrumb structured data
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      }
      
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(breadcrumbData)
      script.id = 'breadcrumb-data'
      
      // Remove existing breadcrumb script if present
      const existingScript = document.getElementById('breadcrumb-data')
      if (existingScript) {
        existingScript.remove()
      }
      
      document.head.appendChild(script)
      
      // Cleanup on unmount
      return () => {
        const scriptToRemove = document.getElementById('breadcrumb-data')
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      }
    }
  }, [breadcrumbs])

  // This component doesn't render anything visible
  return null
}

// Hook for tracking page views (for analytics)
export function usePageView(pageName: string) {
  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined') {
      // Google Analytics 4 event
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: pageName,
          page_location: window.location.href,
        })
      }
      
      // Custom analytics event
      if ((window as any).analytics) {
        (window as any).analytics.page(pageName)
      }
    }
  }, [pageName])
}

// Component for adding canonical URLs dynamically
export function CanonicalURL({ url }: { url: string }) {
  useEffect(() => {
    // Add or update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    
    canonicalLink.href = url
    
    // Cleanup on unmount
    return () => {
      const linkToRemove = document.querySelector('link[rel="canonical"]')
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [url])

  return null
}
