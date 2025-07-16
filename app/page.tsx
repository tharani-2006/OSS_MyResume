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
// VersionDisplay is now integrated into Footer component

export default function Home() {
  const [isV2UI, setIsV2UI] = useState(false);

  const toggleUI = () => {
    setIsV2UI(!isV2UI);
  };

  // V1 UI - Original beautiful design
  if (!isV2UI) {
    return (
      <main className="min-h-screen bg-dark-bg relative">
        {/* V1 - V2 Toggle Button - Blended with navigation */}
        <div className="fixed top-6 right-6 z-[9999]">
          <button
            onClick={toggleUI}
            className="text-cyber-blue hover:text-cyber-purple transition-all duration-300 font-cyber text-sm border border-cyber-blue/20 bg-dark-bg/80 backdrop-blur-sm px-3 py-2 rounded-md hover:border-cyber-purple/40 hover:bg-dark-bg/90"
            title="Switch to Terminal Mode"
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
      <InteractiveTerminal onToggleUI={toggleUI} />
    </div>
  );
}
