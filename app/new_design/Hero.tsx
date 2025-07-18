"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function Hero() {
  const [currentTitle, setCurrentTitle] = useState(0);
  const { isDarkMode } = useDarkMode();
  
  const titles = [
    "network engineer",
    "software engineer trainee",
    "backend developer", 
    "system administrator"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className={`min-h-screen flex flex-col justify-center items-center relative transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Main Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-12">
          <h1 className={`text-8xl md:text-9xl font-thin tracking-tight mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            SVR<span className={`text-4xl md:text-6xl transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>.</span>
          </h1>
          <div className={`w-24 h-px mx-auto mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
        </div>
        
        <div className="space-y-6">
          <h2 className={`text-2xl md:text-3xl font-light tracking-wide transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {titles[currentTitle]}
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Experienced Network Engineer with expertise in network operations, backend development, and system automation. 
            Currently serving as a Software Engineer Trainee at Cisco Systems with CCNA and CCCA certifications.
          </p>
        </div>

        <div className="mt-16 flex justify-center space-x-8">
          <button className={`px-8 py-3 border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}>
            view work
          </button>
          <button className={`px-8 py-3 transition-all duration-300 hover:scale-105 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
            get in touch
          </button>
        </div>
      </div>

      {/* Side Service Label */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 rotate-90 origin-center">
        <div className="flex items-center space-x-4">
          <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>portfolio v3</span>
          <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>MODERN</span>
        </div>
      </div>
    </section>
  );
}
