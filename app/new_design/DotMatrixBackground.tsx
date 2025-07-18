"use client";

import { useDarkMode } from "./DarkModeContext";

export default function DotMatrixBackground() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Main dot matrix pattern */}
      <div 
        className={`absolute inset-0 ${isDarkMode ? 'opacity-30' : 'opacity-30'}`}
      >
        <div className={`w-full h-full ${isDarkMode ? 'bg-white' : 'bg-black'} dots-pattern-large`} />
      </div>
      
      {/* Secondary smaller dots */}
      <div 
        className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-10'}`}
      >
        <div className={`w-full h-full ${isDarkMode ? 'bg-white' : 'bg-black'} dots-pattern-small`} />
      </div>
      
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/20' : 'bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50'}`} />
      
      {/* Subtle moving dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full ${isDarkMode ? 'bg-white/30' : 'bg-black/20'} animate-pulse`} />
        <div className={`absolute top-3/4 right-1/4 w-1 h-1 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-black/30'} animate-pulse animation-delay-1000`} />
        <div className={`absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white/35' : 'bg-black/25'} animate-pulse animation-delay-2000`} />
      </div>
    </div>
  );
}
