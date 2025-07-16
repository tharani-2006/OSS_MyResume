"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  const [deploymentVersion, setDeploymentVersion] = useState('35');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Get current time for error reporting
    setCurrentTime(new Date().toISOString());
    
    // You could also fetch the actual deployment version from an API
    // For now, we'll use the commit count as version number
  }, []);

  const terminalOutput = [
    "$ whoami",
    "user@portfolio-terminal",
    "",
    "$ pwd", 
    "/404/not_found",
    "",
    "$ ls -la",
    "total 0",
    "drwxr-xr-x  2 user user 4096 Jan 15 2025 .",
    "drwxr-xr-x  3 user user 4096 Jan 15 2025 ..",
    "-rw-r--r--  1 user user    0 Jan 15 2025 ERROR.log",
    "",
    "$ cat ERROR.log",
    `[${currentTime}] 404 - Resource not found`,
    `[${currentTime}] Portfolio Terminal v${deploymentVersion}`,
    `[${currentTime}] Redirecting to safe location...`,
    "",
    "$ find / -name 'home' -type d 2>/dev/null",
    "/home",
    "",
    "$ cd /home && ls",
    "about.txt  contact.info  experience.log  projects/  skills.json",
    "",
    "$ echo 'Welcome back to the terminal'",
    "Welcome back to the terminal"
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal Header */}
      <div className="border-b border-green-400/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-400 text-sm">
              terminal@portfolio:~/404$ - Error Handler v{deploymentVersion}
            </span>
          </div>
          <div className="text-xs text-green-400/60">
            Deployment #{deploymentVersion} | Error Code: 404
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left side - Error Message */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left">
                <motion.h1 
                  className="text-6xl md:text-8xl font-bold text-red-400 mb-4"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  404
                </motion.h1>
                <h2 className="text-2xl md:text-3xl text-green-300 mb-4">
                  Command Not Found
                </h2>
                <p className="text-green-400/80 text-lg leading-relaxed">
                  The path you're looking for doesn't exist in this terminal session.
                  Maybe it was moved, deleted, or you typed the wrong command?
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-green-400/30 rounded p-4 bg-green-400/5">
                  <h3 className="text-green-300 font-semibold mb-2">🔧 Quick Commands:</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-yellow-400">cd /</span> - Go to portfolio home</div>
                    <div><span className="text-yellow-400">ls</span> - List available sections</div>
                    <div><span className="text-yellow-400">help</span> - Show all commands</div>
                    <div><span className="text-yellow-400">clear</span> - Clear terminal</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-green-400 text-black px-6 py-3 rounded font-semibold hover:bg-green-300 transition-colors"
                    >
                      🏠 Return to Terminal
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.history.back()}
                    className="flex-1 border border-green-400 text-green-400 px-6 py-3 rounded font-semibold hover:bg-green-400/10 transition-colors"
                  >
                    ← Go Back
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right side - Terminal Output */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border border-green-400/30 rounded bg-black/50"
            >
              <div className="border-b border-green-400/30 p-3 bg-green-400/10">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 font-semibold">Error Recovery Terminal</span>
                  <span className="text-xs text-green-400/60">v{deploymentVersion}</span>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                <div className="space-y-1 text-sm">
                  {terminalOutput.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        line.startsWith('$') 
                          ? 'text-yellow-400 font-semibold' 
                          : line.startsWith('[') 
                            ? 'text-red-400' 
                            : line.startsWith('drwx') || line.startsWith('-rw')
                              ? 'text-blue-400'
                              : 'text-green-400/80'
                      }`}
                    >
                      {line || '\u00A0'}
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: terminalOutput.length * 0.05 + 0.5 }}
                    className="text-yellow-400 font-semibold mt-4"
                  >
                    $ _
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-green-400 ml-1"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="border-t border-green-400/30 pt-6">
              <p className="text-green-400/60 text-sm">
                Portfolio Terminal System v{deploymentVersion} | 
                Build #{deploymentVersion} | 
                Error Logged: {new Date().toLocaleString()}
              </p>
              <p className="text-green-400/40 text-xs mt-2">
                If this error persists, try refreshing or contact the system administrator
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
