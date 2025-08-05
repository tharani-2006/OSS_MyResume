'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { csrf, rateLimit } from '../lib/security'

interface SecurityContextType {
  csrfToken: string | null
  isRateLimited: boolean
  checkRateLimit: (identifier: string) => boolean
  refreshCsrfToken: () => void
  validateCsrfToken: (token: string) => boolean
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

interface SecurityProviderProps {
  children: ReactNode
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Initialize CSRF token on mount
  useEffect(() => {
    refreshCsrfToken()
  }, [])

  const refreshCsrfToken = () => {
    const token = csrf.generateToken()
    csrf.storeToken(token)
    setCsrfToken(token)
  }

  const validateCsrfToken = (token: string): boolean => {
    return csrf.validateToken(token)
  }

  const checkRateLimit = (identifier: string): boolean => {
    // Contact form rate limiting: 5 requests per 15 minutes
    const isAllowed = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      identifier: `contact_${identifier}`,
    })

    if (!isAllowed) {
      setIsRateLimited(true)
      // Reset rate limit status after window
      setTimeout(() => setIsRateLimited(false), 15 * 60 * 1000)
    }

    return isAllowed
  }

  const value: SecurityContextType = {
    csrfToken,
    isRateLimited,
    checkRateLimit,
    refreshCsrfToken,
    validateCsrfToken,
  }

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurity() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}

// Security monitoring hook
export function useSecurityMonitoring() {
  useEffect(() => {
    // Monitor for potential security threats
    const handleSecurityEvent = (event: Event) => {
      // Log security-related events
      if (event.type === 'error') {
        console.warn('Security monitoring: Error event detected')
      }
    }

    // Monitor for suspicious activity
    const handleSuspiciousActivity = () => {
      // Check for rapid form submissions
      const forms = document.querySelectorAll('form')
      forms.forEach(form => {
        let lastSubmission = 0
        form.addEventListener('submit', () => {
          const now = Date.now()
          if (now - lastSubmission < 1000) {
            console.warn('Security monitoring: Rapid form submission detected')
          }
          lastSubmission = now
        })
      })

      // Monitor for console access (potential developer tools usage)
      let devtools = false
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
          if (!devtools) {
            devtools = true
            console.warn('Security monitoring: Developer tools detected')
          }
        } else {
          devtools = false
        }
      }, 500)
    }

    // Set up monitoring
    window.addEventListener('error', handleSecurityEvent)
    handleSuspiciousActivity()

    return () => {
      window.removeEventListener('error', handleSecurityEvent)
    }
  }, [])
}

// Content Security Policy violation reporting
export function useCSPReporting() {
  useEffect(() => {
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
      })

      // In production, you would send this to your logging service
      // fetch('/api/security/csp-violation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     blockedURI: event.blockedURI,
      //     violatedDirective: event.violatedDirective,
      //     sourceFile: event.sourceFile,
      //     lineNumber: event.lineNumber,
      //     timestamp: new Date().toISOString(),
      //   }),
      // })
    }

    document.addEventListener('securitypolicyviolation', handleCSPViolation)

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation)
    }
  }, [])
}

// Secure form component wrapper
interface SecureFormProps {
  children: ReactNode
  onSubmit: (data: FormData, csrfToken: string) => Promise<void>
  className?: string
  rateLimit?: boolean
}

export function SecureForm({ children, onSubmit, className, rateLimit: enableRateLimit = true }: SecureFormProps) {
  const { csrfToken, checkRateLimit, isRateLimited } = useSecurity()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (isSubmitting || isRateLimited) return
    
    const form = event.currentTarget
    const formData = new FormData(form)

    // Rate limiting check
    if (enableRateLimit) {
      const userIdentifier = formData.get('email')?.toString() || 'anonymous'
      if (!checkRateLimit(userIdentifier)) {
        alert('Too many requests. Please wait before submitting again.')
        return
      }
    }

    // CSRF token validation
    if (!csrfToken) {
      alert('Security token missing. Please refresh the page.')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData, csrfToken)
    } catch (error) {
      console.error('Form submission error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* CSRF token hidden field */}
      <input type="hidden" name="csrf_token" value={csrfToken || ''} />
      
      {children}
      
      {isRateLimited && (
        <div className="text-red-400 text-sm mt-2">
          Rate limit exceeded. Please wait before submitting again.
        </div>
      )}
    </form>
  )
}

// Security status indicator component
export function SecurityStatus() {
  const { csrfToken, isRateLimited } = useSecurity()
  const [isSecure, setIsSecure] = useState(false)

  useEffect(() => {
    // Check if the page is served over HTTPS
    const isHTTPS = window.location.protocol === 'https:'
    setIsSecure(isHTTPS && !!csrfToken)
  }, [csrfToken])

  if (process.env.NODE_ENV !== 'development') {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span>Security: {isSecure ? 'Active' : 'Warning'}</span>
      </div>
      {isRateLimited && (
        <div className="text-yellow-400 text-xs">Rate Limited</div>
      )}
    </div>
  )
}
