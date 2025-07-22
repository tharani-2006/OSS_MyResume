"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Experience() {
  const { isDarkMode } = useDarkMode();

  const experiences = [
    {
      id: 1,
      title: "Software Engineer Trainee",
      company: "Cisco Systems",
      location: "Bengaluru, India",
      period: "August 2024 - Present",
      description: [
        "Monitor and support enterprise-level networks to ensure high availability and low latency across distributed systems",
        "Develop and secure REST APIs for internal network automation tools using Java and Spring Boot frameworks",
        "Perform comprehensive packet analysis and network issue resolution using Wireshark and advanced CLI tools",
        "Assist in security policy configuration and assessments including ACLs, NAT, and IP Tables implementation",
        "Script automation solutions for log parsing, configuration backups, and monitoring using Python and Bash",
        "Collaborate on network optimization projects to improve performance and reliability"
      ],
      technologies: ["Java", "Spring Boot", "Python", "Bash", "Wireshark", "Network Security", "REST APIs"]
    },
    {
      id: 2,
      title: "Trainee",
      company: "Cognizant Technology Solutions",
      location: "Bengaluru, India",
      period: "November 2023 - May 2024",
      description: [
        "Completed comprehensive training in IBM Mainframe environments including z/OS, JCL, COBOL, and DB2",
        "Contributed to process automation initiatives in legacy systems to enhance performance and reduce manual overhead",
        "Gained expertise in enterprise system workflows and mainframe application development",
        "Participated in code reviews and quality assurance processes for mainframe applications"
      ],
      technologies: ["z/OS", "JCL", "COBOL", "DB2", "TSO/ISPF", "VSAM", "Mainframe"]
    }
  ];

  const education = {
    degree: "Bachelor of Engineering (B.E.)",
    field: "Electronics and Telecommunication Engineering",
    institution: "Sir M Visvesvaraya Institute of Technology",
    location: "Bengaluru, India",
    period: "[Graduation Year]",
    cgpa: ""
  };

  const certifications = [
    {
      name: "Cisco Certified Network Associate (CCNA)",
      issuer: "Cisco",
      year: "",
      status: "Active"
    },
    {
      name: "Cisco Certified Cybersecurity Associate (CCCA)",
      issuer: "Cisco",
      year: "",
      status: "Active"
    },
    {
      name: "Microsoft Certified: Security, Compliance & Identity",
      issuer: "Microsoft",
      year: "",
      status: "Active"
    },
    {
      name: "Cisco Certified DevNet Associate (DEVASC)",
      issuer: "Cisco",
      year: "",
      status: "Currently Pursuing"
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
