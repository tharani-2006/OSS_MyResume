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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      value: 'vsivareddy.venna@gmail.com',
      href: 'mailto:vsivareddy.venna@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 93989 61541',
      href: 'tel:+919398961541',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Bengaluru, India',
      href: '#',
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
          className="grid lg:grid-cols-2 gap-16"
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
                <motion.a
                  key={info.label}
                  href={info.href}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-border-glow hover:border-cyber-blue/50 transition-all duration-300 group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="w-12 h-12 bg-cyber-blue/10 rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/20 transition-colors duration-300">
                    <info.icon className="text-cyber-blue" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-cyber">{info.label}</div>
                    <div className="text-white font-medium">{info.value}</div>
                  </div>
                </motion.a>
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
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Send Me a Message
            </h3>
            
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
              
              <div className="grid md:grid-cols-2 gap-6">
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
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-border-glow rounded-lg focus:border-cyber-blue focus:outline-none transition-colors duration-300 text-white"
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
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-border-glow rounded-lg focus:border-cyber-blue focus:outline-none transition-colors duration-300 text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-border-glow rounded-lg focus:border-cyber-blue focus:outline-none transition-colors duration-300 text-white"
                  placeholder="Project Discussion"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-bg border border-border-glow rounded-lg focus:border-cyber-blue focus:outline-none transition-colors duration-300 text-white resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full cyber-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send size={20} />
                )}
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
