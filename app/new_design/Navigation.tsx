"use client";

import { useState } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-black/50' : 'bg-white/50'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          <div className={`text-xl font-light tracking-[0.2em] transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>V.V.S.R</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="#home" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>home</a>
            <a href="#about" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>about</a>
            <a href="#skills" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>expertise</a>
            <a href="#experience" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>experience</a>
            <a href="#projects" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>portfolio</a>
            <a href="#contact" className={`text-xs font-light tracking-[0.15em] uppercase transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' : 'text-gray-500 hover:text-black border-b border-transparent hover:border-black'}`}>contact</a>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleDarkMode}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Toggle dark mode"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-colors duration-300 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex flex-col space-y-4">
              <a href="#home" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>home</a>
              <a href="#about" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>about me</a>
              <a href="#skills" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>skills</a>
              <a href="#experience" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>experience</a>
              <a href="#projects" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>projects</a>
              <a href="#contact" className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>contact</a>
              <div className="flex items-center space-x-3 pt-4">
                <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDarkMode ? 'light mode' : 'dark mode'}
                </span>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                  title="Toggle dark mode"
                  aria-label="Toggle dark mode"
                >
                  <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform duration-300 ${isDarkMode ? 'translate-x-6 bg-white' : 'translate-x-0.5 bg-white'}`}>
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      {isDarkMode ? (
                        <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
