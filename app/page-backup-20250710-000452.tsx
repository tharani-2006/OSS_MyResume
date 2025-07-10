"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [terminalText, setTerminalText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const terminalCommands = [
    '$ whoami',
    '> Siva Venkata Reddy Venna',
    '$ cat role.txt',
    '> Full Stack Developer | AI Engineer | DevOps Specialist',
    '$ ls education/',
    '> Masters_Computer_Science/ Bachelors_Computer_Science/',
    '$ echo "Building innovative solutions with cutting-edge technology"',
    '> Building innovative solutions with cutting-edge technology',
    '$ system.status',
    '> ◉ ONLINE | Ready for new challenges'
  ];

  useEffect(() => {
    if (currentIndex < terminalCommands.length) {
      const timer = setTimeout(() => {
        setTerminalText(prev => prev + terminalCommands[currentIndex] + '\n');
        setCurrentIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, terminalCommands]);

  return (
    <motion.main
      className="min-h-screen bg-black text-green-400 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Terminal Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-green-400/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-2xl font-mono text-green-400"
              whileHover={{ scale: 1.05 }}
            >
              &lt;SVR/&gt;
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./home
              </a>
              <a href="#about" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./about
              </a>
              <a href="#skills" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./skills
              </a>
              <a href="#experience" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./experience
              </a>
              <a href="#projects" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./projects
              </a>
              <a href="#contact" className="text-green-400 hover:text-white transition-colors duration-300 font-mono">
                ./contact
              </a>
            </div>
            <div className="text-green-400 font-mono text-sm">
              root@portfolio:~$
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Terminal Hero Section */}
      <section id="home" className="pt-20 pb-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-mono text-sm ml-4">terminal - siva@portfolio</span>
            </div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {terminalText}
              <motion.span
                className="inline-block"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▋
              </motion.span>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-mono text-green-400 mb-4">$ cat about.me</h2>
            <div className="text-green-300 font-mono space-y-2 text-sm">
              <p>{'>'} Experienced Full Stack Developer with 3+ years in the industry</p>
              <p>{'>'} Specialized in AI/ML, Cloud Computing, and DevOps practices</p>
              <p>{'>'} Currently pursuing Master's in Computer Science</p>
              <p>{'>'} Passionate about building scalable, intelligent systems</p>
              <p>{'>'} Strong background in modern web technologies and frameworks</p>
              <p>{'>'} Experienced in leading development teams and mentoring junior developers</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section id="skills" className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-mono text-green-400 mb-4">$ ./skills --display-matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-green-400 font-mono text-lg">Frontend Technologies:</h3>
                <div className="text-green-300 font-mono text-sm space-y-1">
                  <p>React.js ████████████ 95%</p>
                  <p>Next.js ███████████░ 90%</p>
                  <p>TypeScript ████████████ 88%</p>
                  <p>Tailwind CSS ████████████ 92%</p>
                  <p>HTML5/CSS3 ████████████ 98%</p>
                  <p>JavaScript ████████████ 95%</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-green-400 font-mono text-lg">Backend Technologies:</h3>
                <div className="text-green-300 font-mono text-sm space-y-1">
                  <p>Python ████████████ 90%</p>
                  <p>Node.js ████████████ 85%</p>
                  <p>FastAPI ████████████ 88%</p>
                  <p>PostgreSQL ████████████ 85%</p>
                  <p>MongoDB ███████████░ 80%</p>
                  <p>Express.js ████████████ 87%</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-green-400 font-mono text-lg">Cloud & DevOps:</h3>
                <div className="text-green-300 font-mono text-sm space-y-1">
                  <p>AWS ███████████░ 82%</p>
                  <p>Docker ████████████ 88%</p>
                  <p>Kubernetes ██████████░░ 75%</p>
                  <p>CI/CD ████████████ 85%</p>
                  <p>Git ████████████ 95%</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-green-400 font-mono text-lg">AI & Machine Learning:</h3>
                <div className="text-green-300 font-mono text-sm space-y-1">
                  <p>TensorFlow ██████████░░ 78%</p>
                  <p>PyTorch ████████████ 80%</p>
                  <p>OpenAI APIs ████████████ 85%</p>
                  <p>Data Science ███████████░ 82%</p>
                  <p>NLP ██████████░░ 75%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-mono text-green-400 mb-4">$ cat experience.log</h2>
            <div className="space-y-4 text-green-300 font-mono text-sm">
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">2022-Present | Full Stack Developer</p>
                <p>{'>'} Developed and maintained multiple web applications using React and Node.js</p>
                <p>{'>'} Implemented CI/CD pipelines reducing deployment time by 60%</p>
                <p>{'>'} Led a team of 4 developers in building scalable microservices architecture</p>
              </div>
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">2021-2022 | Software Engineer</p>
                <p>{'>'} Built responsive web applications using modern JavaScript frameworks</p>
                <p>{'>'} Optimized database queries improving application performance by 40%</p>
                <p>{'>'} Collaborated with cross-functional teams in agile development environment</p>
              </div>
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">2020-2021 | Junior Developer</p>
                <p>{'>'} Contributed to front-end development using React and TypeScript</p>
                <p>{'>'} Participated in code reviews and maintained high code quality standards</p>
                <p>{'>'} Assisted in debugging and troubleshooting production issues</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Terminal */}
      <section id="projects" className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-2xl font-mono text-green-400 mb-4">$ ls -la ~/projects/</h2>
            <div className="space-y-4 text-green-300 font-mono text-sm">
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">drwxr-xr-x ai-chatbot-platform/</p>
                <p>{'>'} Intelligent chatbot with NLP capabilities and real-time responses</p>
                <p>{'>'} Tech Stack: React, Node.js, OpenAI API, PostgreSQL</p>
                <p>{'>'} Features: Natural language processing, context awareness, multi-language support</p>
              </div>
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">drwxr-xr-x e-commerce-microservices/</p>
                <p>{'>'} Scalable e-commerce platform with microservices architecture</p>
                <p>{'>'} Tech Stack: Docker, Kubernetes, FastAPI, React, Redis</p>
                <p>{'>'} Features: Order management, payment processing, inventory tracking</p>
              </div>
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">drwxr-xr-x data-analytics-dashboard/</p>
                <p>{'>'} Real-time data processing and visualization dashboard</p>
                <p>{'>'} Tech Stack: Python, Apache Kafka, D3.js, MongoDB</p>
                <p>{'>'} Features: Real-time analytics, interactive charts, data export</p>
              </div>
              <div className="border-l-2 border-green-400/30 pl-4">
                <p className="text-green-400">drwxr-xr-x library-management-system/</p>
                <p>{'>'} Complete library management system with book tracking</p>
                <p>{'>'} Tech Stack: React, Express.js, MySQL, JWT Authentication</p>
                <p>{'>'} Features: Book inventory, user management, borrowing system</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Terminal */}
      <section id="contact" className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-black/80 border border-green-400/30 rounded-lg p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-2xl font-mono text-green-400 mb-4">$ contact --establish-connection</h2>
            <div className="text-green-300 font-mono space-y-2 text-sm">
              <p>{'>'} Email: vsivareddy.venna@gmail.com</p>
              <p>{'>'} GitHub: github.com/avis-enna</p>
              <p>{'>'} LinkedIn: linkedin.com/in/sivavenna</p>
              <p>{'>'} Location: Available for remote work</p>
              <p>{'>'} Status: <span className="text-green-400">Open to new opportunities</span></p>
              <p>{'>'} Response Time: Usually within 24 hours</p>
              <div className="mt-4 pt-4 border-t border-green-400/30">
                <p className="text-green-400">Preferred Communication:</p>
                <p>{'>'} Professional inquiries: Email</p>
                <p>{'>'} Collaboration: GitHub</p>
                <p>{'>'} Networking: LinkedIn</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-green-400/30">
        <div className="container mx-auto px-4">
          <p className="text-green-400 font-mono text-sm">
            root@portfolio:~$ echo "© 2024 Siva Venkata Reddy Venna. All systems operational."
          </p>
          <p className="text-green-500 font-mono text-xs mt-2">
            Build: v2.0.0 | Matrix Mode: ACTIVE | Terminal: READY
          </p>
        </div>
      </footer>
    </motion.main>
  );
}
