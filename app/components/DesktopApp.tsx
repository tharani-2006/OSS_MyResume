"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TerminalApp from "./TerminalApp";

interface DesktopAppProps {
  onToggleUI: () => void;
}

export default function DesktopApp({ onToggleUI }: DesktopAppProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    {
      id: 'terminal',
      name: 'Terminal',
      icon: '🖥️',
      description: 'Interactive Portfolio Terminal',
      action: () => setIsTerminalOpen(true)
    },
    {
      id: 'files',
      name: 'Files',
      icon: '📁',
      description: 'File System Explorer',
      action: () => console.log('Files app - Coming Soon!')
    },
    {
      id: 'code',
      name: 'Code Editor',
      icon: '💻',
      description: 'VS Code Style Editor',
      action: () => console.log('Code Editor - Coming Soon!')
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: '🌐',
      description: 'Web Browser',
      action: () => console.log('Browser - Coming Soon!')
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24px,rgba(34,197,94,0.05)_25px,rgba(34,197,94,0.05)_26px,transparent_27px),linear-gradient(-45deg,transparent_24px,rgba(34,197,94,0.05)_25px,rgba(34,197,94,0.05)_26px,transparent_27px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Desktop Header/Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-sm border-b border-green-400/20 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="text-green-400 font-mono text-sm font-bold">SivaOS</div>
          <div className="text-green-400/60 text-xs font-mono">Portfolio Desktop Environment</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-green-400/80 text-xs font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          <motion.button
            onClick={onToggleUI}
            className="text-green-400/70 hover:text-green-300 transition-colors text-xs font-mono px-2 py-1 border border-green-400/30 rounded hover:border-green-400/50"
            whileHover={{ scale: 1.05 }}
            title="Switch to Classic Mode"
          >
            classic_mode
          </motion.button>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="pt-12 h-full">
        {/* Welcome Message */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-green-400 font-mono mb-2">
              Welcome to SivaOS
            </h1>
            <p className="text-green-400/60 font-mono text-lg">
              Interactive Portfolio Desktop Environment
            </p>
          </motion.div>

          {/* App Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={app.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-black/30 border border-green-400/30 rounded-lg p-6 hover:border-green-400/50 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {app.icon}
                  </div>
                  <h3 className="text-green-400 font-mono font-semibold mb-1">
                    {app.name}
                  </h3>
                  <p className="text-green-400/60 text-xs font-mono">
                    {app.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Start Guide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 max-w-xl mx-auto"
          >
            <div className="bg-black/20 border border-green-400/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-green-400 font-mono text-lg mb-4">Quick Start</h3>
              <div className="text-green-400/80 font-mono text-sm space-y-2 text-left">
                <div>🖥️ <span className="text-green-300">Terminal</span> - Navigate portfolio with Linux commands</div>
                <div>📁 <span className="text-green-300">Files</span> - Browse portfolio files and projects</div>
                <div>💻 <span className="text-green-300">Code Editor</span> - View source code and examples</div>
                <div>🌐 <span className="text-green-300">Browser</span> - Access live project demos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-sm border-t border-green-400/20">
        <div className="flex items-center justify-center h-full space-x-4">
          {apps.map((app) => (
            <motion.button
              key={app.id}
              onClick={app.action}
              className="w-12 h-12 bg-black/40 border border-green-400/30 rounded-lg flex items-center justify-center hover:border-green-400/50 hover:bg-black/60 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={app.name}
            >
              <span className="text-2xl">{app.icon}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Terminal App */}
      <TerminalApp 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
}
