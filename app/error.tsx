"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [deploymentVersion, setDeploymentVersion] = useState('35');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  useEffect(() => {
    // Log error details
    console.error('Portfolio Terminal Error:', error);
    
    // Create detailed error log
    const details = [
      `Error: ${error.message}`,
      `Stack: ${error.stack?.substring(0, 200)}...`,
      `Digest: ${error.digest || 'N/A'}`,
      `Timestamp: ${new Date().toISOString()}`,
      `User Agent: ${navigator.userAgent.substring(0, 50)}...`,
      `URL: ${window.location.href}`,
    ];
    
    setErrorDetails(details);
  }, [error]);

  const terminalErrorOutput = [
    "$ systemctl status portfolio-terminal",
    "● portfolio-terminal.service - Interactive Portfolio Terminal",
    "   Loaded: loaded (/etc/systemd/system/portfolio-terminal.service; enabled)",
    "   Active: failed (Result: exit-code) since " + new Date().toLocaleString(),
    "     Docs: https://github.com/avis-enna/MyResume",
    "",
    "$ journalctl -u portfolio-terminal --no-pager -n 10",
    `Jan 15 ${new Date().toLocaleTimeString()} portfolio systemd[1]: portfolio-terminal.service: Main process exited`,
    `Jan 15 ${new Date().toLocaleTimeString()} portfolio systemd[1]: portfolio-terminal.service: Failed with result 'exit-code'`,
    `Jan 15 ${new Date().toLocaleTimeString()} portfolio terminal[1234]: ${error.message}`,
    "",
    "$ cat /var/log/portfolio/error.log | tail -5",
    ...errorDetails.slice(0, 3),
    "",
    "$ systemctl restart portfolio-terminal",
    "Attempting to restart service...",
    "",
    "$ echo 'Recovery options available'",
    "Recovery options available"
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal Header */}
      <div className="border-b border-red-400/30 p-4 bg-red-400/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-500/50 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500/30 rounded-full"></div>
            </div>
            <span className="text-red-400 text-sm">
              terminal@portfolio:~/error$ - System Error Handler v{deploymentVersion}
            </span>
          </div>
          <div className="text-xs text-red-400/60">
            CRITICAL ERROR | Deployment #{deploymentVersion}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left side - Error Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold text-red-400 mb-4"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  SYSTEM ERROR
                </motion.h1>
                <h2 className="text-xl md:text-2xl text-green-300 mb-4">
                  Terminal Process Crashed
                </h2>
                <p className="text-green-400/80 leading-relaxed">
                  The portfolio terminal encountered an unexpected error and had to restart. 
                  This is usually temporary and can be resolved by refreshing the page.
                </p>
              </div>

              {/* Error Details */}
              <div className="border border-red-400/30 rounded p-4 bg-red-400/5">
                <h3 className="text-red-300 font-semibold mb-3 flex items-center">
                  🚨 Error Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-yellow-400">Message:</span> {error.message}</div>
                  {error.digest && (
                    <div><span className="text-yellow-400">Digest:</span> {error.digest}</div>
                  )}
                  <div><span className="text-yellow-400">Version:</span> v{deploymentVersion}</div>
                  <div><span className="text-yellow-400">Time:</span> {new Date().toLocaleString()}</div>
                </div>
              </div>

              {/* Recovery Options */}
              <div className="border border-green-400/30 rounded p-4 bg-green-400/5">
                <h3 className="text-green-300 font-semibold mb-3">🔧 Recovery Options</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={reset}
                    className="w-full bg-green-400 text-black px-4 py-3 rounded font-semibold hover:bg-green-300 transition-colors flex items-center justify-center gap-2"
                  >
                    🔄 Restart Terminal Process
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="w-full border border-yellow-400 text-yellow-400 px-4 py-3 rounded font-semibold hover:bg-yellow-400/10 transition-colors flex items-center justify-center gap-2"
                  >
                    🔃 Force Reload Page
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/'}
                    className="w-full border border-blue-400 text-blue-400 px-4 py-3 rounded font-semibold hover:bg-blue-400/10 transition-colors flex items-center justify-center gap-2"
                  >
                    🏠 Return to Home Terminal
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Right side - System Log Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border border-red-400/30 rounded bg-black/50"
            >
              <div className="border-b border-red-400/30 p-3 bg-red-400/10">
                <div className="flex items-center justify-between">
                  <span className="text-red-300 font-semibold">System Error Log</span>
                  <span className="text-xs text-red-400/60">v{deploymentVersion}</span>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                <div className="space-y-1 text-sm">
                  {terminalErrorOutput.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${
                        line.startsWith('$') 
                          ? 'text-yellow-400 font-semibold' 
                          : line.startsWith('●') 
                            ? 'text-red-400'
                            : line.includes('failed') || line.includes('ERROR') || line.includes('Error')
                              ? 'text-red-300'
                              : line.includes('Active:') || line.includes('Loaded:')
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
                    transition={{ delay: terminalErrorOutput.length * 0.05 + 0.5 }}
                    className="text-yellow-400 font-semibold mt-4"
                  >
                    $ _
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-red-400 ml-1"
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
            className="mt-8 text-center"
          >
            <div className="border-t border-red-400/30 pt-6">
              <p className="text-red-400/60 text-sm">
                Portfolio Terminal System v{deploymentVersion} | 
                Build #{deploymentVersion} | 
                Error Logged: {new Date().toLocaleString()}
              </p>
              <p className="text-green-400/40 text-xs mt-2">
                If this error continues, please report it with the error details above
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
