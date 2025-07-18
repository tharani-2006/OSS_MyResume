"use client";

import { useState } from "react";
// import { motion } from "framer-motion";

// Import V1 components
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import InteractiveTerminal from "./components/InteractiveTerminal";
import NewDesignLayout from "./new_design/NewDesignLayout";
// VersionDisplay is now integrated into Footer component

export default function Home() {
  const [currentUI, setCurrentUI] = useState<'new' | 'v1' | 'v2'>('new');

  const toggleUI = () => {
    if (currentUI === 'new') {
      setCurrentUI('v1');
    } else if (currentUI === 'v1') {
      setCurrentUI('v2');
    } else {
      setCurrentUI('new');
    }
  };

  // New Design - Clean modern design (Default)
  if (currentUI === 'new') {
    return (
      <div className="relative">
        <div className="fixed bottom-6 left-6 z-[9999]">
          <button
            onClick={toggleUI}
            className="text-gray-600 hover:text-black transition-all duration-300 text-xs border border-gray-200 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full hover:border-gray-300 hover:bg-white shadow-lg"
            title="Switch UI Version"
          >
            classic_mode
          </button>
        </div>
        <NewDesignLayout />
      </div>
    );
  }

  // V1 UI - Original beautiful design
  if (currentUI === 'v1') {
    return (
      <main className="min-h-screen bg-dark-bg relative">
        {/* V1 - V2 - New Toggle Button - Blended with navigation */}
        <div className="fixed bottom-6 left-6 z-[9999]">
          <button
            onClick={toggleUI}
            className="text-cyber-blue hover:text-cyber-purple transition-all duration-300 font-cyber text-xs border border-cyber-blue/20 bg-dark-bg/90 backdrop-blur-sm px-3 py-2 rounded-full hover:border-cyber-purple/40 hover:bg-dark-bg shadow-lg"
            title="Switch UI Version"
          >
            terminal_mode
          </button>
        </div>
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Contact />
        <Footer />
        <ChatBot />
      </main>
    );
  }

  // V2 UI - Terminal design
  return (
    <div className="relative">
      <div className="fixed bottom-6 left-6 z-[9999]">
        <button
          onClick={toggleUI}
          className="text-green-400 hover:text-green-300 transition-all duration-300 font-mono text-xs border border-green-400/20 bg-black/90 backdrop-blur-sm px-3 py-2 rounded-full hover:border-green-300/40 hover:bg-black shadow-lg"
          title="Switch UI Version"
        >
          modern_mode
        </button>
      </div>
      <InteractiveTerminal onToggleUI={toggleUI} />
    </div>
  );
}
