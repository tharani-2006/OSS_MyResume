'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react'

export default function Timeline() {
  const timelineData = [
    {
      id: 1,
      type: 'work',
      title: 'Software Engineer Trainee',
      organization: 'Cisco Systems',
      location: 'Bengaluru, India',
      period: 'August 2024 – Present',
      description: [
        'Monitor and support enterprise-level networks to ensure high availability and low latency across distributed systems',
        'Develop and secure REST APIs for internal network automation tools using Java and Spring Boot frameworks',
        'Perform comprehensive packet analysis and network issue resolution using Wireshark and advanced CLI tools',
        'Assist in security policy configuration and assessments including ACLs, NAT, and IP Tables implementation',
        'Script automation solutions for log parsing, configuration backups, and monitoring using Python and Bash'
      ],
      technologies: ['Java', 'Spring Boot', 'Python', 'Bash', 'Wireshark', 'Network Security'],
      current: true
    },
    {
      id: 2,
      type: 'work',
      title: 'Trainee',
      organization: 'Cognizant Technology Solutions',
      location: 'Bengaluru, India',
      period: 'November 2023 – May 2024',
      description: [
        'Completed comprehensive training in IBM Mainframe environments including z/OS, JCL, COBOL, and DB2',
        'Contributed to process automation initiatives in legacy systems to enhance performance and reduce manual overhead',
        'Gained expertise in enterprise system workflows and mainframe application development',
        'Participated in code reviews and quality assurance processes for mainframe applications'
      ],
      technologies: ['z/OS', 'JCL', 'COBOL', 'DB2', 'TSO/ISPF', 'VSAM'],
      current: false
    },
    {
      id: 3,
      type: 'education',
      title: 'Bachelor of Engineering (B.E.)',
      organization: 'Sir M Visvesvaraya Institute of Technology',
      location: 'Bengaluru, India',
      period: '2020 – 2024',
      description: [
        'Electronics and Telecommunication Engineering',
        'Specialized in IoT systems, network protocols, and embedded systems',
        'Published research paper on "IoT-Based Continuous Abiotic Factor Monitoring" in IJFMR',
        'Developed comprehensive projects integrating hardware and software solutions'
      ],
      technologies: ['IoT', 'Arduino', 'React', 'Java', 'Network Protocols'],
      current: false
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="timeline" className="section-padding bg-card-bg/10">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            My <span className="cyber-text">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A timeline of my educational and professional journey in technology
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyber-blue via-cyber-purple to-cyber-blue"></div>

          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {timelineData.map((item, index) => (
              <motion.div
                key={item.id}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                variants={itemVariants}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-cyber border-4 border-dark-bg z-10"></div>

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <motion.div
                    className="cyber-card relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Current Badge */}
                    {item.current && (
                      <div className="absolute -top-2 -right-2 bg-cyber-blue text-dark-bg px-3 py-1 rounded-full text-xs font-bold">
                        Current
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gradient-cyber rounded-lg">
                        {item.type === 'work' ? (
                          <Briefcase className="text-dark-bg" size={20} />
                        ) : (
                          <GraduationCap className="text-dark-bg" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <div className="flex items-center gap-2 text-cyber-blue font-semibold mb-2">
                          <Building size={16} />
                          <span>{item.organization}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{item.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 mb-4">
                      {item.description.map((desc, descIndex) => (
                        <div key={descIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-cyber-purple rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-dark-bg/50 border border-border-glow rounded text-xs text-cyber-blue"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-5/12"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional Achievements */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cyber-card max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-cyber-blue mb-4">Honors & Publications</h3>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyber-purple rounded-full mt-2"></div>
              <p className="text-gray-300 text-left">
                <strong>Research Paper:</strong> "IoT-Based Continuous Abiotic Factor Monitoring" – 
                International Journal of Multidisciplinary Research (IJFMR), May–June 2023
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
