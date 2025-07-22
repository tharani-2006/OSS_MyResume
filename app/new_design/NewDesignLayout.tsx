"use client";

import { DarkModeProvider, useDarkMode } from "./DarkModeContext";
import Navigation from "./Navigation";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import DotMatrixBackground from "./DotMatrixBackground";

function LayoutContent() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <DotMatrixBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function NewDesignLayout() {
  return (
    <DarkModeProvider>
      <LayoutContent />
    </DarkModeProvider>
  );
}
