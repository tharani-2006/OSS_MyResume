'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Code, Smartphone, Globe, Database } from 'lucide-react'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Library Management System',
      description: 'Advanced DBMS project featuring interactive CRUD operations, real-time statistics, and comprehensive database design. Includes member management, book borrowing/returning, overdue tracking, and live API demonstrations with professional web interface.',
      tech: ['PostgreSQL', 'Python', 'Flask', 'SQLite', 'SQL', 'Database Design', 'CRUD Operations', 'REST API', 'Interactive UI'],
      image: '/api/placeholder/600/400',
      github: 'https://github.com/avis-enna/library-management-system',
      live: 'https://your-demo-url.railway.app', // Update this with your Railway URL when available
      category: 'Database',
      icon: Database,
    },
    {
      id: 2,
      title: 'Secure Authentication System',
      description: 'JWT-based authentication with multi-factor authentication, rate limiting, and security monitoring.',
      tech: ['Node.js', 'Express.js', 'JWT', 'bcrypt', 'Redis', 'PostgreSQL'],
      image: '/api/placeholder/600/400',
      github: '#',
      live: '#',
      category: 'Security',
      icon: Code,
    },
    {
      id: 3,
      title: 'RESTful API with Database',
      description: 'Scalable REST API architecture with CRUD operations, input validation, and error handling.',
      tech: ['Python', 'Flask/FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Docker'],
      image: '/api/placeholder/600/400',
      github: '#',
      live: '#',
      category: 'Backend',
      icon: Globe,
    },
    {
      id: 4,
      title: 'Containerized Microservice',
      description: 'Docker-based microservice with automated deployment pipeline and health monitoring.',
      tech: ['Docker', 'Docker Compose', 'Node.js', 'GitHub Actions', 'AWS'],
      image: '/api/placeholder/600/400',
      github: '#',
      live: '#',
      category: 'DevOps',
      icon: Database,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="projects" className="section-padding">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Featured <span className="cyber-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Conceptual projects showcasing my technical knowledge and the type of solutions I'm passionate about building
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="cyber-card group overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden rounded-lg mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center">
                  <project.icon size={48} className="text-cyber-blue" />
                </div>
                <div className="absolute inset-0 bg-dark-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-cyber-blue text-dark-bg rounded-full hover:bg-white transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                  </motion.a>
                  {project.live !== '#' && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-cyber-purple text-white rounded-full hover:bg-cyber-pink transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white group-hover:text-cyber-blue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="text-cyber-blue text-sm font-cyber bg-cyber-blue/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="text-xs px-2 py-1 bg-dark-bg border border-border-glow rounded text-gray-300"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyber-blue transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <Github size={16} />
                    <span className="text-sm">
                      {project.github === '#' ? 'In Development' : 'View Code'}
                    </span>
                  </motion.a>
                  {project.live !== '#' ? (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-300 hover:text-cyber-purple transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <ExternalLink size={16} />
                      <span className="text-sm">Live Demo</span>
                    </motion.a>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <ExternalLink size={16} />
                      <span className="text-sm">Coming Soon</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Projects Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href="#contact"
            className="cyber-button inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Build Something Together
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
