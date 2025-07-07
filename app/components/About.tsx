'use client'

import { motion } from 'framer-motion'
import { User, Award, Coffee, Clock } from 'lucide-react'

export default function About() {
  const stats = [
    { icon: Award, label: 'Years Experience', value: '3+' },
    { icon: Coffee, label: 'Projects Completed', value: '50+' },
    { icon: Clock, label: 'Hours Coded', value: '5000+' },
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
              <p className="text-cyber-blue font-cyber">Backend Developer</p>
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
                I'm a passionate Backend Developer with expertise in building secure, scalable 
                server-side applications. I specialize in designing robust APIs, managing databases, 
                and implementing cybersecurity best practices.
              </p>
              
              <p>
                My journey in software development focuses on backend technologies, system architecture, 
                and security implementations. I enjoy solving complex problems related to data management, 
                performance optimization, and secure deployment strategies.
              </p>
              
              <p>
                When I'm not coding, you'll find me exploring cybersecurity trends, learning about 
                new deployment technologies, or contributing to open-source security tools. I believe 
                in building systems that are not just functional, but also secure and maintainable.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyber-blue">What I Do</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Backend Development',
                  'API Design & Development',
                  'Database Architecture',
                  'Cybersecurity Implementation',
                  'Cloud Deployment & DevOps',
                  'System Performance Optimization',
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
                  'AWS Certified Solutions Architect',
                  'CompTIA Security+',
                  'Certified Kubernetes Administrator',
                  'Docker Certified Associate',
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
