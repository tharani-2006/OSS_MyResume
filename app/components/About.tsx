'use client'

import { motion } from 'framer-motion'
import { User, Award, Coffee, Clock } from 'lucide-react'

export default function About() {
  const stats = [
    { icon: Award, label: 'Years Experience', value: '1+' },
    { icon: Coffee, label: 'Projects Completed', value: '5+' },
    { icon: Clock, label: 'Hours Coded', value: '2000+' },
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="about" className="section-padding">
      <div className="container-max">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Side - Image & Stats */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Profile Card */}
            <div className="cyber-card text-center">
              <div className="w-48 h-48 mx-auto mb-6 relative">
                <div className="w-full h-full bg-gradient-cyber rounded-full p-1">
                  <div className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center">
                    <User size={80} className="text-cyber-blue" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Venna Venkata Siva Reddy</h3>
              <p className="text-cyber-blue font-cyber">Software Engineer Trainee @ Cisco</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="cyber-card text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="text-cyber-blue mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold cyber-text">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - About Content */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <h2 className="text-4xl font-bold mb-4">
                About <span className="cyber-text">Me</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-cyber mb-6"></div>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I'm a passionate Network Engineer with hands-on experience in network operations, 
                backend development, and system automation. Currently working at Cisco Systems 
                as a Software Engineer Trainee, where I monitor and support enterprise-level networks 
                to ensure high availability and low latency.
              </p>
              
              <p>
                My experience includes developing and securing REST APIs for internal network automation 
                tools using Java and Spring Boot frameworks. I perform comprehensive packet analysis 
                and network issue resolution using Wireshark and advanced CLI tools, while assisting 
                in security policy configuration and assessments.
              </p>
              
              <p>
                I have a strong foundation in TCP/IP, routing, switching, and Linux system administration. 
                My expertise extends to scripting automation solutions for log parsing, configuration 
                backups, and monitoring using Python and Bash. I also have experience with IBM Mainframe 
                environments from my previous role at Cognizant Technology Solutions.
              </p>
              
              <p>
                When I'm not working, you'll find me pursuing additional certifications like the 
                Cisco Certified DevNet Associate (DEVASC), exploring new networking technologies, 
                or contributing to IoT projects. I believe in continuous learning and staying 
                updated with the latest industry trends.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyber-blue">What I Do</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Network Engineering',
                  'REST API Development',
                  'Enterprise Network Support',
                  'Security Policy Configuration',
                  'Automation Scripting',
                  'Packet Analysis & Troubleshooting',
                ].map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="flex items-center space-x-2"
                    variants={itemVariants}
                  >
                    <div className="w-2 h-2 bg-cyber-blue rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyber-purple">Certifications</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Cisco Certified Network Associate (CCNA)',
                  'Cisco Certified Cybersecurity Associate (CCCA)',
                  'Microsoft Certified: Security, Compliance & Identity',
                  'Currently Pursuing: Cisco Certified DevNet Associate (DEVASC)',
                ].map((cert, index) => (
                  <motion.div
                    key={cert}
                    className="flex items-center space-x-2 p-3 bg-dark-bg/50 rounded-lg border border-border-glow"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-2 h-2 bg-cyber-purple rounded-full"></div>
                    <span className="text-gray-300">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.a
              href="#contact"
              className="inline-block cyber-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Work Together
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
