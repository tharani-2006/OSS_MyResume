"use client";

import { motion } from 'framer-motion';
import { Download, FileText, Eye, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ResumeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(247); // Mock download count

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = '/Venna_Venkata_Siva_Reddy_Resume_Updated (1).docx';
      link.download = 'Venna_Venkata_Siva_Reddy_Resume.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadCount(prev => prev + 1);
      setIsDownloading(false);
    }, 1000);
  };

  const handlePreview = () => {
    // Open resume in new tab for preview
    window.open('/Venna_Venkata_Siva_Reddy_Resume_Updated (1).docx', '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Venna Venkata Siva Reddy - Resume',
          text: 'Check out my professional resume',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <section className="section-padding bg-gradient-to-r from-dark-bg via-card-bg to-dark-bg">
      <div className="container-max">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Download My <span className="cyber-text">Resume</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-8"></div>
          
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Get a comprehensive overview of my experience, skills, and achievements in a professionally formatted document.
          </p>

          {/* Resume Preview Card */}
          <motion.div
            className="cyber-card max-w-md mx-auto mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-cyber-blue/10 rounded-lg">
                <FileText size={32} className="text-cyber-blue" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Professional Resume</h3>
                <p className="text-gray-400 text-sm">Updated January 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
                <div className="text-cyber-blue font-semibold">2+ Years</div>
                <div className="text-gray-400">Experience</div>
              </div>
              <div className="text-center p-3 bg-dark-bg/50 rounded-lg">
                <div className="text-cyber-purple font-semibold">15+ Skills</div>
                <div className="text-gray-400">Technologies</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Download Button */}
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full cyber-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isDownloading ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Resume</span>
                  </>
                )}
              </motion.button>

              {/* Secondary Actions */}
              <div className="flex space-x-2">
                <motion.button
                  onClick={handlePreview}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-cyber-blue hover:text-cyber-blue transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye size={14} />
                  <span className="text-sm">Preview</span>
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-cyber-purple hover:text-cyber-purple transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={14} />
                  <span className="text-sm">Share</span>
                </motion.button>
              </div>
            </div>

            {/* Download Stats */}
            <div className="mt-6 pt-4 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-400">
                Downloaded <span className="text-cyber-blue font-semibold">{downloadCount}</span> times
              </p>
            </div>
          </motion.div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-cyber-blue text-2xl font-bold mb-2">PDF & DOCX</div>
              <p className="text-gray-400 text-sm">Available in multiple formats</p>
            </motion.div>

            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-cyber-purple text-2xl font-bold mb-2">ATS Friendly</div>
              <p className="text-gray-400 text-sm">Optimized for applicant tracking systems</p>
            </motion.div>

            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-cyber-pink text-2xl font-bold mb-2">Updated</div>
              <p className="text-gray-400 text-sm">Regularly updated with latest projects</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
