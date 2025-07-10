"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Import V1 components
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import PetBird from "./components/PetBird";

export default function Home() {
  const [isV2UI, setIsV2UI] = useState(false);

  const toggleUI = () => {
    console.log('Toggle clicked! Current state:', isV2UI);
    setIsV2UI(!isV2UI);
    console.log('New state will be:', !isV2UI);
  };

  // V1 UI - Original beautiful design
  if (!isV2UI) {
    return (
      <main className="min-h-screen bg-dark-bg relative">
        {/* V1 - V2 Toggle Button - Blended with navigation */}
        <div className="fixed top-6 right-6 z-[9999]">
          <motion.button
            onClick={toggleUI}
            className="text-cyber-blue hover:text-cyber-purple transition-all duration-300 font-cyber text-sm border border-cyber-blue/20 bg-dark-bg/80 backdrop-blur-sm px-3 py-2 rounded-md hover:border-cyber-purple/40 hover:bg-dark-bg/90"
            whileHover={{ scale: 1.05 }}
            title="Switch to Terminal Mode"
          >
            terminal_mode
          </motion.button>
        </div>
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Contact />
        <Footer />
        <ChatBot />
      </main>
    );
  }

  // V2 UI - Terminal design
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden">
      <PetBird />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Terminal Window */}
          <div className="border border-green-400/30 rounded-lg p-6 bg-black/50 backdrop-blur-sm">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 transition-colors"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-colors"></div>
                <span className="text-green-400 font-mono text-sm ml-4">terminal@sivareddy:~$</span>
              </div>
              {/* Terminal-style toggle */}
              <motion.button
                onClick={toggleUI}
                className="text-green-400/70 hover:text-green-300 transition-colors text-xs font-mono flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
                title="Switch to Classic Mode"
              >
                <span className="text-green-400/50">$</span>
                <span>exit_terminal</span>
              </motion.button>
            </div>
            
            {/* Terminal Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="text-green-400/80 text-sm mb-2">$ whoami</p>
                  <motion.h1 
                    className="text-4xl font-bold text-green-300 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Venna Venkata Siva Reddy
                  </motion.h1>
                  <p className="text-green-400/80 text-lg">
                    Network Engineer | Software Engineer Trainee @ Cisco Systems
                  </p>
                </motion.div>
              </div>

              {/* Navigation */}
              <div className="mb-8">
                <p className="text-green-400/80 text-sm mb-3">$ ls -la sections/</p>
                <div className="flex flex-wrap gap-4">
                  {['about', 'skills', 'experience', 'projects', 'contact'].map((section, index) => (
                    <motion.span
                      key={section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-green-300 hover:text-green-200 cursor-pointer transition-colors text-sm"
                    >
                      {section}/
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-green-400/30 p-4 rounded bg-black/30"
              >
                <p className="text-green-400/80 text-sm mb-2">$ cat about.txt</p>
                <h3 className="text-green-300 font-semibold mb-2">About Me</h3>
                <p className="text-green-400/80 text-sm">
                  Experienced Network Engineer with expertise in TCP/IP, routing, switching, 
                  and Linux system administration. Currently serving as a Software Engineer Trainee 
                  at Cisco Systems with CCNA and CCCA certifications. Passionate about building 
                  scalable, secure, and reliable enterprise systems.
                </p>
              </motion.div>
              
              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border border-green-400/30 p-4 rounded bg-black/30"
              >
                <p className="text-green-400/80 text-sm mb-2">$ cat skills.json</p>
                <h3 className="text-green-300 font-semibold mb-2">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-400/80 text-sm">
                  <div>
                    <p className="text-green-300 font-semibold">Networking:</p>
                    <p>• TCP/IP, OSPF, BGP, VLANs, ACLs</p>
                    <p>• Cisco IOS, Network Troubleshooting</p>
                    <p>• CCNA, CCCA Certified</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-semibold">Programming:</p>
                    <p>• Python, Java, Spring Boot</p>
                    <p>• React, JavaScript, HTML/CSS</p>
                    <p>• Linux, Git, DevOps, MongoDB</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Experience Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-green-400/30 p-4 rounded bg-black/30"
              >
                <p className="text-green-400/80 text-sm mb-2">$ cat experience.log</p>
                <h3 className="text-green-300 font-semibold mb-2">Professional Experience</h3>
                <div className="space-y-4 text-green-400/80 text-sm">
                  <div>
                    <p className="text-green-300 font-semibold">Cisco Systems</p>
                    <p>Software Engineer Trainee (Aug 2024 - Present)</p>
                    <p>• Working on enterprise networking solutions</p>
                    <p>• Developing software applications for network management</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-semibold">Cognizant Technology Solutions</p>
                    <p>Trainee (Nov 2023 - May 2024)</p>
                    <p>• Gained experience in enterprise software development</p>
                    <p>• Worked on various client projects and training programs</p>
                  </div>
                </div>
              </motion.div>

              {/* Projects Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border border-green-400/30 p-4 rounded bg-black/30"
              >
                <p className="text-green-400/80 text-sm mb-2">$ ls projects/</p>
                <h3 className="text-green-300 font-semibold mb-4">Featured Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-400/20 p-3 rounded bg-black/20">
                    <h4 className="text-green-300 font-semibold text-sm mb-1">Network Automation Tool</h4>
                    <p className="text-green-400/70 text-xs mb-2">Python, Cisco IOS, Network Management</p>
                    <p className="text-green-400/80 text-xs">
                      Automated network configuration and monitoring tool for enterprise environments.
                    </p>
                  </div>
                  <div className="border border-green-400/20 p-3 rounded bg-black/20">
                    <h4 className="text-green-300 font-semibold text-sm mb-1">Portfolio Website</h4>
                    <p className="text-green-400/70 text-xs mb-2">React, Next.js, Tailwind CSS</p>
                    <p className="text-green-400/80 text-xs">
                      Dual-UI portfolio website with modern and terminal-inspired interfaces.
                    </p>
                  </div>
                  <div className="border border-green-400/20 p-3 rounded bg-black/20">
                    <h4 className="text-green-300 font-semibold text-sm mb-1">System Monitor</h4>
                    <p className="text-green-400/70 text-xs mb-2">Python, Linux, System Administration</p>
                    <p className="text-green-400/80 text-xs">
                      Real-time system monitoring and alerting tool for Linux servers.
                    </p>
                  </div>
                  <div className="border border-green-400/20 p-3 rounded bg-black/20">
                    <h4 className="text-green-300 font-semibold text-sm mb-1">Network Topology Mapper</h4>
                    <p className="text-green-400/70 text-xs mb-2">Java, Spring Boot, Network Discovery</p>
                    <p className="text-green-400/80 text-xs">
                      Automatic network topology discovery and visualization application.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="border border-green-400/30 p-4 rounded bg-black/30"
              >
                <p className="text-green-400/80 text-sm mb-2">$ cat contact.info</p>
                <h3 className="text-green-300 font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-400/80 text-sm">
                  <div>
                    <p>📧 vsivareddy.venna@gmail.com</p>
                    <p>📱 +91 93989 61541</p>
                  </div>
                  <div>
                    <p>🔗 linkedin.com/in/sivavenna</p>
                    <p>📍 Bengaluru, India</p>
                  </div>
                </div>
              </motion.div>

              {/* Terminal Prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-2 mt-8"
              >
                <span className="text-green-400">$</span>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-green-400"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
