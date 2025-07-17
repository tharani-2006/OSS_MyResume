'use client'

import { motion } from 'framer-motion'
import { Heart, Code, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string;
  shortVersion?: string;
  buildNumber?: number;
  commitCount?: number;
  commit?: string;
  environment?: string;
}

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    fetchVersionInfo(controller.signal);
    
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchVersionInfo = async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/version', { signal });
      const data = await response.json();
      if (data.success) {
        setVersionInfo(data.data);
      }
    } catch (error) {
      // Silent fallback for production - only log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Version fetch failed:', error);
      }
      setVersionInfo({
        version: '1.0.0',
        shortVersion: 'v1.0',
        buildNumber: 0,
        commitCount: 0,
        commit: 'unknown',
        environment: 'production'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="bg-dark-bg border-t border-border-glow">
      <div className="container-max">
        {/* Main Footer Content */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Brand Column */}
          <div className="space-y-4">
            <motion.div
              className="text-2xl font-cyber cyber-text font-bold"
              whileHover={{ scale: 1.05 }}
            >
              &lt;SVR/&gt;
            </motion.div>
            <p className="text-gray-300 leading-relaxed">
              Backend Developer passionate about building secure, scalable server-side solutions 
              and implementing robust cybersecurity practices.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Code size={16} />
              <span className="text-sm">Built with Next.js & Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyber-blue">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-cyber-blue transition-colors duration-300 w-fit"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyber-purple">Get In Touch</h3>
            <div className="space-y-2 text-gray-300">
              <p>Ready to work together?</p>
              <motion.a
                href="#contact"
                className="inline-block text-cyber-blue hover:text-cyber-purple transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Let's build something amazing →
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-border-glow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© 2025 Venna Venkata Siva Reddy. Made with</span>
            <Heart size={16} className="text-cyber-pink" />
            <span>and lots of coffee</span>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">
              Version {versionInfo?.version || 'Loading...'}
            </span>
            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse" />
            <span className="text-cyber-blue text-sm font-cyber">Online</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-cyber-blue text-dark-bg rounded-full flex items-center justify-center shadow-lg hover:bg-cyber-purple transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          y: showScrollTop ? 0 : 20 
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  )
}
