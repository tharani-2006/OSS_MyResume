"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PetBird() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const messages = [
    "🐦 Terminal Bird v2.0 online!",
    "💻 Monitoring system status...",
    "✨ All services running smoothly",
    "🎯 Ready for interactive mode",
    "🚀 Performance optimal",
    "📊 Windows manager active",
    "🎨 UI system initialized"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const moveTimer = setInterval(() => {
      setPosition({
        x: Math.random() * (window.innerWidth - 150),
        y: Math.random() * (window.innerHeight - 150)
      });
      
      // Show message occasionally
      if (Math.random() < 0.3) {
        setCurrentMessage(Math.floor(Math.random() * messages.length));
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    }, 8000);

    return () => clearInterval(moveTimer);
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-green-400 text-3xl cursor-pointer select-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🐦
      </motion.div>
      
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="absolute left-1/2 transform -translate-x-1/2 bg-black/90 text-green-400 px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-green-400/40 backdrop-blur-sm"
          >
            <div className="font-mono">{messages[currentMessage]}</div>
            {/* Speech bubble arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-400/40"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}