"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    "Initializing portfolio...",
    "Loading components...",
    "Establishing connections...",
    "Optimizing performance...",
    "Ready to showcase!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50));
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete, loadingSteps.length]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-dark-bg flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-md mx-auto px-6">
            {/* Logo/Brand */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-cyber-blue/20 rounded-full"></div>
                <motion.div
                  className="absolute inset-0 border-4 border-cyber-blue rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <div className="absolute inset-4 bg-gradient-cyber rounded-full flex items-center justify-center">
                  <span className="text-dark-bg font-bold text-lg">SR</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold cyber-text">Siva Reddy</h1>
              <p className="text-gray-400 text-sm mt-2">Full Stack Developer</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-cyber rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              {/* Progress Percentage */}
              <motion.div
                className="text-cyber-blue font-mono text-lg font-semibold"
                key={Math.floor(progress)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(progress)}%
              </motion.div>
            </div>

            {/* Loading Steps */}
            <motion.div
              className="text-gray-300 text-sm font-mono"
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loadingSteps[currentStep]}
            </motion.div>

            {/* Animated Dots */}
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-cyber-blue rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Terminal-style Loading Animation */}
            <div className="mt-8 bg-black/50 rounded-lg p-4 font-mono text-xs text-left">
              <div className="text-green-400 mb-2">$ initializing_portfolio.sh</div>
              <div className="space-y-1">
                {loadingSteps.slice(0, currentStep + 1).map((step, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-2 ${
                      index === currentStep ? 'text-yellow-400' : 'text-green-400'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span>
                      {index < currentStep ? '✓' : index === currentStep ? '⟳' : '○'}
                    </span>
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
