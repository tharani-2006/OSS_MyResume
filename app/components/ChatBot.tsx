'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { AI_CONFIG } from '../config/ai-config'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatBotProps {
  apiEndpoint?: string
  apiKey?: string
}

export default function ChatBot({ 
  apiEndpoint = AI_CONFIG.getApiUrl(),
  apiKey = AI_CONFIG.API_KEY
}: ChatBotProps) {
  console.log('ChatBot initialized with:', { apiEndpoint, apiKey })
  
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Siva's AI assistant. I can tell you about his experience, projects, and skills. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const checkAiServiceHealth = async () => {
    try {
      const healthUrl = AI_CONFIG.getHealthUrl()
      console.log('Checking health at:', healthUrl)
      console.log('Using API key:', apiKey)
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey
        }
      })
      
      console.log('Health check response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Health check data:', data)
        setIsOnline(true)
      } else {
        console.log('Health check failed')
        setIsOnline(false)
      }
    } catch (error) {
      console.log('Health check error:', error)
      setIsOnline(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    // Check AI service health on component mount and when opening chat
    checkAiServiceHealth()
    
    // Check health every 30 seconds when chat is open
    let healthCheckInterval: NodeJS.Timeout
    if (isOpen) {
      healthCheckInterval = setInterval(checkAiServiceHealth, 30000)
    }
    
    return () => {
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval)
      }
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Fallback responses for when the AI service is not available
      const fallbackResponses = {
        experience: "Siva has 2+ years of experience in backend development, specializing in Python, Node.js, and database management. He's worked with technologies like FastAPI, PostgreSQL, and has built several production-ready applications including this very AI chatbot you're using!",
        projects: "Siva has built several impressive projects including this AI Chatbot Microservice with Ollama integration, a comprehensive Library Management System with PostgreSQL, and a Secure E-Commerce Microservices Platform. All projects demonstrate his expertise in backend development and system architecture.",
        skills: "His technical skills include Python, Node.js, JavaScript, PostgreSQL, SQLite, FastAPI, Express.js, Docker, Redis, JWT authentication, microservices architecture, and AI integration with Ollama. He's also experienced with WebSocket communication and API design.",
        contact: "You can reach Siva through the contact section below, connect with him on LinkedIn, or check out his projects on GitHub. He's always open to discussing backend development opportunities and innovative projects.",
        ai: "This AI chatbot is one of Siva's projects! It's built with Node.js, TypeScript, Express.js, and integrates with Ollama for AI responses. It features WebSocket communication, session management, and is deployed as a microservice. You're experiencing it right now!",
        default: "Thanks for your question! I'm Siva's AI assistant, powered by his custom-built chatbot microservice. Feel free to ask about his experience, projects, or technical skills. You can also scroll down to see his detailed portfolio or use the contact form to get in touch directly."
      }

      let response = fallbackResponses.default
      const query = inputMessage.toLowerCase()

      // Determine appropriate fallback response
      if (query.includes('experience') || query.includes('work') || query.includes('background')) {
        response = fallbackResponses.experience
      } else if (query.includes('project') || query.includes('portfolio') || query.includes('built') || query.includes('created')) {
        response = fallbackResponses.projects
      } else if (query.includes('skill') || query.includes('technology') || query.includes('tech') || query.includes('language')) {
        response = fallbackResponses.skills
      } else if (query.includes('contact') || query.includes('reach') || query.includes('email') || query.includes('hire')) {
        response = fallbackResponses.contact
      } else if (query.includes('ai') || query.includes('chatbot') || query.includes('assistant') || query.includes('bot')) {
        response = fallbackResponses.ai
      }

      // Try to call the live AI service first
      try {
        console.log('Attempting to call AI service:', apiEndpoint)
        console.log('Using API key:', apiKey)
        
        const apiResponse = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
          },
          body: JSON.stringify({
            message: inputMessage.trim(),
            sessionId: sessionId
          })
        })

        console.log('API Response status:', apiResponse.status)
        
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          console.log('API Response data:', data)
          
          if (data.success && data.data && data.data.response) {
            response = data.data.response
            setIsOnline(true)
            console.log('Using AI response:', response)
          } else if (data.response) {
            response = data.response
            setIsOnline(true)
            console.log('Using AI response (fallback format):', response)
          }
        } else {
          console.log('API response not ok:', apiResponse.status)
          setIsOnline(false)
        }
      } catch (error) {
        console.log('AI service error:', error)
        setIsOnline(false)
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please feel free to explore Siva's portfolio below or use the contact form to get in touch directly!",
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full shadow-2xl border border-cyber-blue/50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={24} className="text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-pink rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-dark-card border border-border-glow rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-cyber-blue to-cyber-purple p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Siva's AI Assistant</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <p className="text-white/70 text-sm">
                      {isOnline ? 'AI Enhanced' : 'Smart Fallback Mode'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[360px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-cyber-blue' 
                        : 'bg-cyber-purple'
                    }`}>
                      {message.isUser ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-cyber-blue text-white rounded-br-sm'
                        : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-cyber-purple rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={16} className="text-cyber-blue animate-spin" />
                        <span className="text-sm text-gray-300">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border-glow p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Siva's experience..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyber-blue transition-colors"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-cyber-blue text-white rounded-lg hover:bg-cyber-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
