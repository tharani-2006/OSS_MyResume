"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Experience() {
  const { isDarkMode } = useDarkMode();

  const experiences = [
    {
      id: 1,
      title: "Software Engineer Trainee",
      company: "Cisco Systems",
      location: "Hyderabad, India",
      period: "July 2024 - Present",
      description: [
        "Developing and maintaining network management software solutions",
        "Working on IoT device integration and monitoring systems",
        "Implementing security protocols for network infrastructure",
        "Collaborating on microservices architecture design and development",
        "Contributing to automation tools for network operations"
      ],
      technologies: ["Java", "React", "Node.js", "Network Protocols", "IoT", "Microservices"]
    },
    {
      id: 2,
      title: "Programmer Analyst Trainee",
      company: "Cognizant Technology Solutions",
      location: "Hyderabad, India", 
      period: "February 2023 - June 2024",
      description: [
        "Developed full-stack web applications using React and Node.js",
        "Implemented database solutions with PostgreSQL and MySQL",
        "Created RESTful APIs and microservices architecture",
        "Participated in agile development methodologies and sprint planning",
        "Contributed to code reviews and technical documentation"
      ],
      technologies: ["React", "Node.js", "PostgreSQL", "MySQL", "REST APIs", "Agile"]
    }
  ];

  const education = {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Electronics and Telecommunication Engineering",
    institution: "Sreenidhi Institute of Science and Technology",
    location: "Hyderabad, India",
    period: "2019 - 2023",
    cgpa: "8.5/10"
  };

  const certifications = [
    {
      name: "CCNA (Cisco Certified Network Associate)",
      issuer: "Cisco",
      year: "2024",
      status: "Valid through 2027"
    },
    {
      name: "CCCA (Cisco Certified CyberOps Associate)",
      issuer: "Cisco", 
      year: "2024",
      status: "Valid through 2027"
    },
    {
      name: "Microsoft Azure Fundamentals (AZ-900)",
      issuer: "Microsoft",
      year: "2024",
      status: "Valid through 2026"
    }
  ];

  return (
    <section id="experience" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-thin mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>experience</h2>
            <div className={`w-16 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
          </div>

          {/* Professional Experience */}
          <div className="mb-20">
            <h3 className={`text-2xl font-light mb-12 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Professional Experience</h3>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {/* Timeline line */}
                  {index < experiences.length - 1 && (
                    <div className={`absolute left-6 top-16 w-px h-32 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                  )}
                  
                  <div className="flex items-start space-x-8">
                    {/* Timeline dot */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-2 border-gray-700' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className={`p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h4 className={`text-xl font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                              {exp.title}
                            </h4>
                            <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {exp.company}
                            </p>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {exp.location}
                            </p>
                          </div>
                          <div className={`text-sm font-medium px-3 py-1 rounded-full mt-2 md:mt-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            {exp.period}
                          </div>
                        </div>
                        
                        <ul className={`space-y-2 mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.description.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span key={tech} className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Education</h3>
              <div className={`p-8 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {education.degree}
                </h4>
                <p className={`text-base mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {education.field}
                </p>
                <p className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {education.institution}
                </p>
                <p className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {education.location}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {education.period}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    CGPA: {education.cgpa}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Certifications</h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/10 border-gray-800/30' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-base font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {cert.name}
                    </h4>
                    <p className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {cert.issuer} • {cert.year}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
