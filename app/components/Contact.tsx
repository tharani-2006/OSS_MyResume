'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitType, setSubmitType] = useState<'success' | 'error' | ''>('')
  const [fieldFocus, setFieldFocus] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [formProgress, setFormProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Calculate form completion progress
    const updatedData = { ...formData, [name]: value }
    const filledFields = Object.values(updatedData).filter(val => val.trim() !== '').length
    setFormProgress((filledFields / 4) * 100)
  }

  const handleFocus = (fieldName: string) => {
    setFieldFocus(fieldName)
  }

  const handleBlur = () => {
    setFieldFocus(null)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(label)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitType('')
    
    try {
      // Method 1: Try EmailJS first (primary method)
      try {
        // EmailJS configuration from environment variables
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        // Check if EmailJS is configured
        if (serviceId && templateId && publicKey) {
          const result = await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message,
              reply_to: formData.email,
            },
            publicKey
          )
          
          setSubmitMessage('Message sent successfully! I\'ll get back to you soon.')
          setSubmitType('success')
          setFormData({ name: '', email: '', subject: '', message: '' })
          setIsSubmitting(false)
          return
        } else {
          throw new Error('EmailJS not configured')
        }
      } catch (error) {
        console.error('EmailJS Error:', error)
      }

      // Method 2: Try API route as backup
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          setSubmitMessage('Message sent successfully! I\'ll get back to you soon.')
          setSubmitType('success')
          setFormData({ name: '', email: '', subject: '', message: '' })
          setIsSubmitting(false)
          return
        }
      } catch (error) {
        console.error('API route failed:', error)
      }

      // Method 3: Fallback to mailto (always works)
      const mailtoLink = `mailto:vsivareddy.venna@gmail.com?subject=${encodeURIComponent(
        `Portfolio Contact: ${formData.subject}`
      )}&body=${encodeURIComponent(
        `Hi Siva,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\nBest regards,\n${formData.name}`
      )}`
      
      window.open(mailtoLink, '_blank')
      setSubmitMessage('Opening your email client to send the message. Please send the email from your email app.')
      setSubmitType('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
    } catch (error) {
      setSubmitMessage('Failed to send message. Please contact me directly at vsivareddy.venna@gmail.com')
      setSubmitType('error')
    }
    
    setIsSubmitting(false)
    
    // Clear message after 7 seconds
    setTimeout(() => {
      setSubmitMessage('')
      setSubmitType('')
    }, 7000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'sivareddy.venna@gmail.com',
      href: 'mailto:sivareddy.venna@gmail.com',
      description: 'Best way to reach me',
      copyable: true,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9390018166',
      href: 'tel:+919390018166',
      description: 'Available 9 AM - 6 PM IST',
      copyable: true,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Hyderabad, India',
      href: '#',
      description: 'Open to remote work',
      copyable: false,
    },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/avis-enna', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/sivavenna', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="section-padding bg-card-bg/20">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Get In <span className="cyber-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to bring your ideas to life
          </p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-8 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Information */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-cyber-blue">
                Let's Connect
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                I'm always open to discussing backend development opportunities, cybersecurity projects, 
                or collaborating on secure system architectures. Let's build something secure together!
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  className="relative p-3 sm:p-4 rounded-lg border border-border-glow hover:border-cyber-blue/50 transition-all duration-300 group overflow-hidden touch-target"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId={`bg-${index}`}
                  />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-cyber-blue/10 rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/20 transition-colors duration-300">
                        <info.icon className="text-cyber-blue" size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 font-cyber">{info.label}</div>
                        <div className="text-white font-medium">{info.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.a
                        href={info.href}
                        className="p-2 bg-dark-bg border border-border-glow rounded-lg hover:border-cyber-blue transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <info.icon size={16} className="text-gray-400 hover:text-cyber-blue" />
                      </motion.a>
                      
                      {info.copyable && (
                        <motion.button
                          onClick={() => copyToClipboard(info.value, info.label)}
                          className="p-2 bg-dark-bg border border-border-glow rounded-lg hover:border-cyber-purple transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg className="w-4 h-4 text-gray-400 hover:text-cyber-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Copy success indicator */}
                  {copySuccess === info.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded"
                    >
                      Copied!
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyber-purple">
                Follow Me
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-dark-bg border border-border-glow rounded-lg flex items-center justify-center text-gray-400 hover:text-cyber-blue hover:border-cyber-blue transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div className="cyber-card" variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">
                Send Me a Message
              </h3>
              <div className="text-sm text-gray-400">
                <span className="text-cyber-blue font-medium">{Math.round(formProgress)}%</span> complete
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-dark-bg rounded-full h-1 border border-border-glow">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Response Time Indicator */}
            <motion.div
              className="flex items-center space-x-2 mb-6 p-3 bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Typically responds within <span className="text-cyber-blue font-medium">24 hours</span>
              </span>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success/Error Message */}
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    submitType === 'success'
                      ? 'bg-green-500/10 border-green-500/50 text-green-400'
                      : 'bg-red-500/10 border-red-500/50 text-red-400'
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    required
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none transition-all duration-300 text-gray-400 cursor-not-allowed opacity-60"
                    placeholder="Your Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none transition-all duration-300 text-gray-400 cursor-not-allowed opacity-60"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.subject.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus('subject')}
                  onBlur={handleBlur}
                  required
                  maxLength={100}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none transition-all duration-300 text-gray-400 cursor-not-allowed opacity-60"
                  placeholder="Project Discussion"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.message.length}/1000
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  required
                  rows={5}
                  maxLength={1000}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none transition-all duration-300 text-gray-400 resize-none cursor-not-allowed opacity-60"
                  placeholder="Tell me about your project, ideas, or just say hello..."
                />
              </div>
              
              <motion.button
                type="button"
                disabled={true}
                className="w-full bg-gray-700 text-gray-400 border border-gray-600 rounded-lg py-3 px-6 flex items-center justify-center space-x-2 cursor-not-allowed opacity-60 relative overflow-hidden"
                title="Contact form is disabled - please use direct email or phone"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>Form Disabled</span>
                </div>
              </motion.button>

              {/* Subtle form status note */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                Having issues? Email me directly at vsivareddy.venna@gmail.com
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
