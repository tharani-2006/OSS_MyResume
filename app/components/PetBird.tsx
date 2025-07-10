"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PetBird() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const moveTimer = setInterval(() => {
      if (isVisible) {
        setPosition({
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100)
        });
      }
    }, 5000);

    return () => clearInterval(moveTimer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-green-400 text-2xl cursor-pointer"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🐦
      </motion.div>
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-green-400 px-2 py-1 rounded text-xs whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Terminal Bird v2.0
      </motion.div>
    </motion.div>
  );
}