"use client";

import { useDarkMode } from "./DarkModeContext";

export default function Skills() {
  const { isDarkMode } = useDarkMode();

  const skillCategories = [
    {
      title: "Networking",
      skills: [
        "TCP/IP", "ARP", "OSPF", "BGP", "VLANs", "ACLs", "IP Tables", "NAT", "Routing & Switching", "Network Security"
      ]
    },
    {
      title: "Programming & Scripting",
      skills: [
        "Python", "Java", "C/C++", "Shell Scripting (Bash)", "SQL"
      ]
    },
    {
      title: "Web Technologies",
      skills: [
        "Java Spring Boot", "React", "REST APIs", "JSON", "HTML/CSS"
      ]
    },
    {
      title: "Operating Systems",
      skills: [
        "Linux (Ubuntu/CentOS/RHEL)", "Windows Server", "z/OS (IBM Mainframe)"
      ]
    },
    {
      title: "Network Tools",
      skills: [
        "Wireshark", "Cisco Packet Tracer", "GNS3", "Network Analyzers", "SNMP Tools"
      ]
    },
    {
      title: "Development Tools",
      skills: [
        "Git", "DevOps", "CI/CD Pipelines", "Automated Testing (Axe, WAVE)"
      ]
    },
    {
      title: "Databases",
      skills: [
        "MongoDB", "IBM DB2", "SQL Server", "Database Design and Optimization"
      ]
    },
    {
      title: "Mainframe Technologies",
      skills: [
        "JCL", "COBOL", "z/OS", "TSO/ISPF", "VSAM"
      ]
    }
  ];

  const certifications = [
    "Cisco Certified Network Associate (CCNA)",
    "Cisco Certified Cybersecurity Associate (CCCA)",
    "Microsoft Certified: Security, Compliance & Identity",
    "Currently Pursuing: Cisco Certified DevNet Associate (DEVASC)"
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
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></span>
                      <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                Experienced Network Engineer with expertise in network operations, backend development, and system automation.
                Strong foundation in TCP/IP, routing, switching, and Linux system administration. Proven track record in
                developing REST APIs, network troubleshooting, and automation scripting. Passionate about building scalable,
                secure, and reliable enterprise systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
