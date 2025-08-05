'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useSecurity, useSecurityMonitoring, useCSPReporting } from './SecurityProvider'

interface SecurityEvent {
  id: string
  type: 'info' | 'warning' | 'error'
  message: string
  timestamp: Date
}

export default function SecurityMonitor() {
  const { csrfToken, isRateLimited } = useSecurity()
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)

  // Initialize security monitoring
  useSecurityMonitoring()
  useCSPReporting()

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Calculate security score
    let score = 0
    
    // HTTPS check
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      score += 25
    }
    
    // CSRF token check
    if (csrfToken) {
      score += 25
    }
    
    // Rate limiting check
    if (!isRateLimited) {
      score += 25
    }
    
    // Security headers check (simulated)
    score += 25
    
    setSecurityScore(score)

    // Add initial security status event
    addEvent('info', 'Security monitoring initialized')

    // Monitor for security events
    const handleSecurityEvent = (event: CustomEvent) => {
      addEvent(event.detail.type, event.detail.message)
    }

    window.addEventListener('security-event', handleSecurityEvent as EventListener)

    return () => {
      window.removeEventListener('security-event', handleSecurityEvent as EventListener)
    }
  }, [csrfToken, isRateLimited])

  const addEvent = (type: SecurityEvent['type'], message: string) => {
    const event: SecurityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
    }
    
    setEvents(prev => [event, ...prev.slice(0, 9)]) // Keep last 10 events
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle
    if (score >= 70) return AlertTriangle
    return XCircle
  }

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Security Status Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          securityScore >= 90
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : securityScore >= 70
            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">{securityScore}%</span>
      </button>

      {/* Security Monitor Panel */}
      {isVisible && (
        <div className="absolute bottom-12 left-0 w-80 bg-black/95 border border-gray-700 rounded-lg shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-medium">Security Monitor</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Security Score */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Security Score</span>
              <div className="flex items-center space-x-1">
                {(() => {
                  const Icon = getScoreIcon(securityScore)
                  return <Icon className={`w-4 h-4 ${getScoreColor(securityScore)}`} />
                })()}
                <span className={`font-medium ${getScoreColor(securityScore)}`}>
                  {securityScore}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  securityScore >= 90
                    ? 'bg-green-400'
                    : securityScore >= 70
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </div>

          {/* Security Status */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white text-sm font-medium mb-3">Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">HTTPS</span>
                <div className="flex items-center space-x-1">
                  {typeof window !== 'undefined' && window.location.protocol === 'https:' ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 text-xs">Inactive</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">CSRF Protection</span>
                <div className="flex items-center space-x-1">
                  {csrfToken ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 text-xs">Inactive</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs">Rate Limiting</span>
                <div className="flex items-center space-x-1">
                  {!isRateLimited ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Normal</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs">Limited</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="p-4">
            <h4 className="text-white text-sm font-medium mb-3">Recent Events</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-400 text-xs">No events recorded</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      event.type === 'error' ? 'bg-red-400' :
                      event.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs truncate">{event.message}</p>
                      <p className="text-gray-500 text-xs">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
