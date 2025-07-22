"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Skills() {
  const { isDarkMode } = useDarkMode();

  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Java", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "Python", level: 88 },
        { name: "TypeScript", level: 80 },
        { name: "C++", level: 75 }
      ]
    },
    {
      title: "Web Technologies",
      skills: [
        { name: "React.js", level: 90 },
        { name: "Node.js", level: 88 },
        { name: "Next.js", level: 85 },
        { name: "Express.js", level: 82 },
        { name: "HTML/CSS", level: 95 }
      ]
    },
    {
      title: "Databases",
      skills: [
        { name: "PostgreSQL", level: 88 },
        { name: "MySQL", level: 85 },
        { name: "MongoDB", level: 78 }
      ]
    },
    {
      title: "Networking & Security",
      skills: [
        { name: "Network Protocols", level: 92 },
        { name: "Network Security", level: 88 },
        { name: "Cisco Technologies", level: 85 },
        { name: "IoT Systems", level: 80 }
      ]
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS", level: 75 },
        { name: "Docker", level: 70 },
        { name: "Git/GitHub", level: 90 },
        { name: "Linux", level: 85 }
      ]
    }
  ];

  const certifications = [
    "CCNA (Cisco Certified Network Associate)",
    "CCCA (Cisco Certified CyberOps Associate)", 
    "Microsoft Azure Fundamentals (AZ-900)"
  ];

  return (
    <section id="skills" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-thin mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>skills</h2>
            <div className={`w-16 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className={`p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-lg font-medium mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {skill.name}
                        </span>
                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className={`w-full h-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-1 rounded-full transition-all duration-1000 ease-out ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="text-center">
            <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Professional Certifications
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className={`px-6 py-3 rounded-full border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/20 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}>
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Expertise Summary */}
          <div className="mt-16 text-center">
            <div className={`max-w-4xl mx-auto p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Technical Expertise
              </h3>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Specialized in full-stack development with strong expertise in modern web technologies, 
                network security, and IoT systems. Experienced in building scalable applications using 
                React, Node.js, and various database technologies. Certified in Cisco networking 
                technologies with hands-on experience in network protocols and cybersecurity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
