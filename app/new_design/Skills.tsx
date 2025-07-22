"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Skills() {
  const { isDarkMode } = useDarkMode();

  const skillCategories = [
    {
      title: "Cloud & DevOps",
      skills: [
        "Kubernetes", "Docker", "Helm", "FluxCD", "CI/CD", "AWS", "GCP"
      ]
    },
    {
      title: "Programming Languages",
      skills: [
        "Java", "Python", "JavaScript", "SQL", "Shell Scripting", "COBOL"
      ]
    },
    {
      title: "Backend",
      skills: [
        "Spring Boot", "REST APIs", "SOAP Web Services", "Microservices"
      ]
    },
    {
      title: "Frontend",
      skills: [
        "React", "JavaScript", "HTML", "CSS"
      ]
    },
    {
      title: "Databases",
      skills: [
        "SQL", "MongoDB", "IBM DB2", "VSAM"
      ]
    },
    {
      title: "Mainframe",
      skills: [
        "JCL", "COBOL"
      ]
    },
    {
      title: "Networking",
      skills: [
        "TCP/IP", "HTTP", "Network Device Configuration & Troubleshooting"
      ]
    }
  ];

  const certifications = [
    "Cisco Certified DevNet Associate (DEVASC)",
    "Cisco Certified Network Associate (CCNA)",
    "Cisco Certified Cybersecurity Associate (CCCA)"
  ];

  return (
    <section id="skills" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-light tracking-[0.1em] uppercase mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>expertise</h2>
            <div className={`w-24 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-stone-400'}`}></div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className={`p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-stone-50 border-stone-200'}`}>
                <h3 className={`text-lg font-medium mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-stone-400'}`}></span>
                      <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="text-center">
            <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
              Professional Certifications
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className={`px-6 py-3 rounded-full border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/20 border-gray-700 text-gray-300' : 'bg-stone-100 border-stone-300 text-stone-700'}`}>
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Expertise Summary */}
          <div className="mt-16 text-center">
            <div className={`max-w-4xl mx-auto p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-stone-50 border-stone-200'}`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                Technical Expertise
              </h3>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>
                A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. 
                Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend 
                implementation with React. Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
