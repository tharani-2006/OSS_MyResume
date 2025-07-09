'use client'

import { motion } from 'framer-motion'

export default function Skills() {
  const skillCategories = [
    {
      title: 'Networking & Infrastructure',
      skills: [
        { name: 'TCP/IP', level: 92 },
        { name: 'Routing & Switching', level: 90 },
        { name: 'VLANs', level: 88 },
        { name: 'ACLs & Security', level: 85 },
        { name: 'OSPF', level: 82 },
        { name: 'BGP', level: 75 },
        { name: 'NAT & IP Tables', level: 88 },
        { name: 'Network Troubleshooting', level: 90 },
      ]
    },
    {
      title: 'Programming & Development',
      skills: [
        { name: 'Python', level: 88 },
        { name: 'Java', level: 85 },
        { name: 'Spring Boot', level: 82 },
        { name: 'Shell Scripting (Bash)', level: 90 },
        { name: 'C/C++', level: 75 },
        { name: 'REST APIs', level: 88 },
        { name: 'SQL', level: 85 },
        { name: 'React', level: 80 },
      ]
    },
    {
      title: 'Tools & Technologies',
      skills: [
        { name: 'Wireshark', level: 92 },
        { name: 'Cisco Packet Tracer', level: 90 },
        { name: 'GNS3', level: 85 },
        { name: 'Linux (Ubuntu/CentOS)', level: 88 },
        { name: 'Git & DevOps', level: 82 },
        { name: 'MongoDB', level: 80 },
        { name: 'IBM DB2', level: 75 },
        { name: 'Mainframe (z/OS, JCL)', level: 70 },
      ]
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="skills" className="section-padding bg-card-bg/20">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            My <span className="cyber-text">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="cyber-card"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-cyber-blue mb-6 text-center">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      duration: 0.4 
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-cyber-blue text-sm font-cyber">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-border-glow rounded-full h-2">
                      <motion.div
                        className="bg-gradient-cyber h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.2,
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold mb-8">
            Technologies I <span className="cyber-text">Love</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Docker',
              'AWS', 'Redis', 'Express.js', 'RESTful APIs', 'Cybersecurity', 'Linux'
            ].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-4 py-2 bg-dark-bg border border-cyber-blue/30 rounded-full text-cyber-blue font-cyber text-sm hover:border-cyber-blue hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
