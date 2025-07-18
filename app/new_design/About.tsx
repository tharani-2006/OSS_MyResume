"use client";

import { useDarkMode } from "./DarkModeContext";


export default function About() {
  const { isDarkMode } = useDarkMode();

  return (
    <section id="about" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-thin mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>about</h2>
            <div className={`w-16 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 items-start">
            {/* Profile Section */}
            <div className="lg:col-span-1 text-center">
              <div className={`w-60 h-60 rounded-2xl mx-auto mb-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border border-gray-800/30' : 'bg-gray-50 border border-gray-200'}`}>
                <img
                  src="/profile-photo.png"
                  alt="Venna Venkata Siva Reddy"
                  width={240}
                  height={240}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  
                />
              </div>
              <h3 className={`text-2xl font-light mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Venna Venkata Siva Reddy</h3>
              <p className={`text-sm mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Network Engineer & Software Developer
              </p>
              <div className="flex justify-center space-x-6 mb-8">
                <a href="https://linkedin.com/in/sivavenna" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  LINKEDIN
                </a>
                <a href="https://github.com/sivavenna" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  GITHUB
                </a>
                <a href="mailto:vsivareddy.venna@gmail.com" className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  EMAIL
                </a>
              </div>
            </div>

            {/* About Content */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <p className={`text-lg leading-relaxed mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Experienced Network Engineer with expertise in network operations, backend development, and system automation. 
                  Currently serving as a Software Engineer Trainee at Cisco Systems with CCNA and CCCA certifications.
                </p>
                <p className={`leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Strong foundation in TCP/IP, routing, switching, and Linux system administration. Passionate about building 
                  scalable, secure, and reliable enterprise systems.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </div>
                  <h4 className={`text-base font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Network & Security</h4>
                  <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>CCNA, CCCA certified with expertise in TCP/IP, routing, switching</p>
                </div>

                <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h4 className={`text-base font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Full Stack Development</h4>
                  <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Java Spring Boot, React, REST APIs, database design</p>
                </div>

                <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM5 4h14v12H5V4z"/>
                    </svg>
                  </div>
                  <h4 className={`text-base font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>System Administration</h4>
                  <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Linux, Windows Server, automation scripting</p>
                </div>

                <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 className={`text-base font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>DevOps & Cloud</h4>
                  <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Docker, CI/CD, monitoring, infrastructure automation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Summary */}
          <div className="mt-20">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className={`text-lg font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>I've had experiences with</h4>
                  <ul className={`space-y-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Network Monitoring & Analysis</li>
                    <li>PostgreSQL & MongoDB</li>
                    <li>GIT, GitHub, Version Control</li>
                    <li>Python & Shell Scripting</li>
                    <li>Docker & Containerization</li>
                    <li>System Administration</li>
                    <li>Database Design</li>
                    <li>REST API Development</li>
                  </ul>
                </div>

                <div className="text-center">
                  <h4 className={`text-lg font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>I have years of experience with</h4>
                  <ul className={`space-y-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Network Engineering (CCNA/CCCA)</li>
                    <li>Java Spring Boot</li>
                    <li>TCP/IP, Routing & Switching</li>
                    <li>Linux System Administration</li>
                    <li>Security Implementation</li>
                    <li>Performance Optimization</li>
                    <li>Enterprise System Design</li>
                    <li>Network Troubleshooting</li>
                  </ul>
                </div>

                <div className="text-center">
                  <h4 className={`text-lg font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>I work and study about</h4>
                  <ul className={`space-y-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>Cloud Technologies (AWS, Azure)</li>
                    <li>Microservices Architecture</li>
                    <li>DevOps & CI/CD Practices</li>
                    <li>Network Security & Compliance</li>
                    <li>IoT & Real-time Systems</li>
                    <li>Log Analysis & Monitoring</li>
                    <li>Automation & Orchestration</li>
                    <li>Modern Web Technologies</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
