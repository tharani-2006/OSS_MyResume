"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function Hero() {
  const [currentTitle, setCurrentTitle] = useState(0);
  const { isDarkMode } = useDarkMode();
  
  const titles = [
    "software engineer",
    "cloud architect",
    "systems developer",
    "technology consultant"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            Distinguished software engineer specializing in cloud-native architectures and enterprise systems.
            Currently architecting scalable solutions at Cisco Systems with expertise in Kubernetes and modern development practices.
          </p>
        </div>

        <div className="mt-16 flex justify-center space-x-8">
          <button
            onClick={() => scrollToSection('projects')}
            className={`px-10 py-4 border-2 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}
          >
            portfolio
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`px-10 py-4 font-light tracking-wider text-sm uppercase transition-all duration-500 hover:scale-[1.02] ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-600 hover:text-black border-b border-transparent hover:border-black'}`}
          >
            contact
          </button>
        </div>
      </div>

      {/* Side Service Label */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 rotate-90 origin-center">
        <div className="flex items-center space-x-6">
          <span className={`text-xs font-light tracking-[0.2em] transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>PORTFOLIO</span>
          <div className={`w-8 h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <span className={`text-xs font-light tracking-[0.2em] transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>MMXXIV</span>
        </div>
      </div>
    </section>
  );
}
