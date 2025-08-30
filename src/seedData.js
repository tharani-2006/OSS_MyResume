import connectDB from './db.js';
import QA from './models/qa.model.js';

const sampleQAData = [
  // Personal Information
  {
    question: "Who are you?",
    answer: "I'm Venna Venkata Siva Reddy, a results-driven Software Engineer currently working at Cisco Systems. I'm based in Bengaluru, India, and specialize in backend development, cybersecurity, and network engineering.",
    category: "personal",
    tags: ["name", "introduction", "location", "cisco", "engineer"]
  },
  {
    question: "What is your full name?",
    answer: "My full name is Venna Venkata Siva Reddy. You can call me Siva Reddy or just Siva.",
    category: "personal",
    tags: ["name", "full name", "siva reddy"]
  },
  {
    question: "Where are you located?",
    answer: "I'm currently based in Bengaluru, Karnataka, India. You can reach me at +91 93989 61541 or vsivareddy.venna@gmail.com.",
    category: "personal",
    tags: ["location", "bengaluru", "india", "contact", "phone", "email"]
  },

  // Current Role & Experience
  {
    question: "Where do you currently work?",
    answer: "I'm currently working as a Software Engineer at Cisco Systems since August 2024. I focus on migrating legacy systems to modern cloud-native environments and developing scalable microservices.",
    category: "experience",
    tags: ["cisco", "current job", "software engineer", "cloud", "microservices"]
  },
  {
    question: "What do you do at Cisco?",
    answer: "At Cisco Systems, I lead the migration of IoT Control Center's core services from Docker to Kubernetes architecture. I manage applications using Helm charts, implement GitOps workflows with FluxCD, and develop Java Spring Boot microservices with REST and SOAP APIs. I also implement SSO using Duo and build React frontend modules.",
    category: "experience",
    tags: ["cisco", "kubernetes", "docker", "helm", "gitops", "spring boot", "react"]
  },
  {
    question: "What was your previous experience?",
    answer: "Before Cisco, I worked as a Trainee at Cognizant Technology Solutions from November 2023 to May 2024, where I maintained large-scale mainframe banking applications, developed COBOL programs, and worked with DB2 and VSAM technologies.",
    category: "experience",
    tags: ["cognizant", "mainframe", "cobol", "banking", "db2", "vsam"]
  },

  // Skills & Technologies - Enhanced
  {
    question: "What technologies do you work with?",
    answer: "I specialize in a comprehensive tech stack including: Cloud & DevOps (Kubernetes, Docker, Helm, FluxCD, AWS, GCP), Programming (Java, Python, JavaScript/TypeScript, SQL, Shell Scripting, COBOL), Backend (Spring Boot, REST APIs, SOAP, Microservices), Frontend (React, Next.js, HTML, CSS), and Databases (PostgreSQL, MongoDB, IBM DB2, VSAM). I also have strong networking skills with TCP/IP and device configuration.",
    category: "skills",
    tags: ["technologies", "kubernetes", "docker", "java", "python", "react", "spring boot", "postgresql"]
  },
  {
    question: "What programming languages do you know?",
    answer: "I'm proficient in Java (Spring Boot microservices), Python (automation and backend), JavaScript/TypeScript (React, Node.js), SQL (database management), Shell Scripting (automation), and COBOL (mainframe systems). I focus on modern web technologies and enterprise-level backend development.",
    category: "skills",
    tags: ["programming", "java", "python", "javascript", "typescript", "sql", "cobol"]
  },
  {
    question: "Do you have experience with databases?",
    answer: "Yes! I have extensive experience with multiple database systems: PostgreSQL and MySQL for relational data, MongoDB for NoSQL applications, IBM DB2 for mainframe systems, and VSAM for indexed data storage. I'm skilled in database design, optimization, stored procedures, triggers, and performance tuning.",
    category: "skills",
    tags: ["database", "postgresql", "mongodb", "mysql", "db2", "vsam", "optimization"]
  },
  {
    question: "What cloud technologies do you use?",
    answer: "I work extensively with cloud platforms including AWS and Google Cloud Platform (GCP). I have hands-on experience with containerization using Docker, orchestration with Kubernetes, and infrastructure as code. I also implement CI/CD pipelines and manage cloud-native applications.",
    category: "skills",
    tags: ["cloud", "aws", "gcp", "docker", "kubernetes", "cicd", "infrastructure"]
  },

  // Certifications
  {
    question: "What certifications do you have?",
    answer: "I hold several Cisco certifications: Cisco Certified DevNet Associate (DEVASC) for network programmability, Cisco Certified Network Associate (CCNA) for networking fundamentals, and Cisco Certified Cybersecurity Associate (CCCA) for security expertise. These certifications complement my hands-on experience in network engineering and cybersecurity.",
    category: "certifications",
    tags: ["certifications", "cisco", "devasc", "ccna", "ccca", "networking", "cybersecurity"]
  },
  {
    question: "Do you have any networking certifications?",
    answer: "Yes! I'm Cisco Certified Network Associate (CCNA) certified, which validates my skills in network fundamentals, network access, IP connectivity, IP services, security fundamentals, and automation. I also have the DevNet Associate certification for network programmability.",
    category: "certifications",
    tags: ["ccna", "networking", "cisco", "devnet", "network engineering"]
  },

  // Projects - Comprehensive
  {
    question: "Tell me about your projects",
    answer: "I've developed several enterprise-grade projects: 🔧 Network Automation Toolkit (Python/Flask with SNMP and device management), 🔒 Security Compliance Monitor (FastAPI/React with vulnerability scanning), 🌐 Network Topology Discovery (Java/Spring Boot with React frontend), 📚 Library Management System (PostgreSQL with advanced SQL features), 📊 Log Analysis System (Java/Spring Boot with real-time processing), and 💼 This interactive portfolio website (Next.js/TypeScript).",
    category: "projects",
    tags: ["projects", "network automation", "security", "topology", "library", "portfolio"]
  },
  {
    question: "What is your Network Automation Toolkit?",
    answer: "My Network Automation Toolkit is a production-grade enterprise platform built with Python and Flask. It features intelligent device discovery using SNMP v2c/v3, configuration lifecycle management with version control, bulk deployment with Jinja2 templates, real-time health monitoring, and security compliance auditing. It supports multi-vendor devices including Cisco IOS/NX-OS, Juniper JunOS, and Arista EOS.",
    category: "projects",
    tags: ["network automation", "python", "flask", "snmp", "cisco", "enterprise"]
  },
  {
    question: "Tell me about your Security Monitor project",
    answer: "The Network Security Compliance Monitor is an automated security auditing system built with FastAPI and React. It performs vulnerability assessments using Nmap and OpenVAS, monitors compliance with SOC 2, ISO 27001, and NIST frameworks, validates ACL policies, enforces security configurations, and generates detailed compliance reports. It includes real-time alerting and remediation guidance.",
    category: "projects",
    tags: ["security monitor", "fastapi", "react", "vulnerability", "compliance", "nmap"]
  },
  {
    question: "What is your Library Management System?",
    answer: "My Library Management System demonstrates advanced PostgreSQL skills with normalized database design (3NF), stored procedures, triggers, views, and performance optimization. It includes a full REST API built with Flask/Python, features full-text search capabilities, audit trails, and comprehensive reporting. The project showcases enterprise-level database management and API development skills.",
    category: "projects",
    tags: ["library management", "postgresql", "database", "flask", "rest api", "sql"]
  },
  {
    question: "Do you have any Java projects?",
    answer: "Yes! I've built a comprehensive Log Analysis System using Java 17+ with Spring Boot. It features real-time log processing with Apache Kafka and Spark, pattern detection, security analysis, performance monitoring, and an interactive dashboard. The system includes configurable alerts, data export capabilities, and integration with Elasticsearch for advanced search.",
    category: "projects",
    tags: ["java", "spring boot", "log analysis", "kafka", "elasticsearch", "real-time"]
  },
  {
    question: "What is your portfolio website built with?",
    answer: "This interactive portfolio is built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion for smooth animations. It features a terminal-inspired design, responsive layout, dark/light theme switching, real-time project data integration, and is optimized for performance. The site is deployed on Vercel with comprehensive SEO optimization.",
    category: "projects",
    tags: ["portfolio", "nextjs", "typescript", "tailwind", "vercel", "terminal"]
  },

  // Education & Background
  {
    question: "What is your educational background?",
    answer: "I completed my Bachelor of Engineering (B.E.) in Electronics and Telecommunication Engineering from Sir M Visvesvaraya Institute of Technology in Bengaluru. This strong engineering foundation has been instrumental in my understanding of both hardware and software systems, particularly in networking and telecommunications.",
    category: "education",
    tags: ["education", "engineering", "electronics", "telecommunication", "visvesvaraya", "bengaluru"]
  },
  {
    question: "What is your experience level?",
    answer: "I have hands-on experience in migrating legacy systems to modern cloud-native environments, with proven expertise in the full software development lifecycle. My experience spans from backend development with Java/Spring Boot to frontend implementation with React, specialized in Kubernetes, Docker, and GitOps workflows. I also have unique cross-functional experience combining software engineering with network engineering (CCNA certified) and data analytics.",
    category: "experience",
    tags: ["experience", "cloud-native", "fullstack", "kubernetes", "network engineering", "analytics"]
  },
  {
    question: "How long have you been programming?",
    answer: "I've been programming professionally since my training at Cognizant in 2023, and currently working at Cisco Systems since August 2024. My journey includes experience with modern technologies like Java, Python, JavaScript, as well as legacy systems like COBOL and mainframe technologies. I'm constantly learning and adapting to new technologies and best practices.",
    category: "experience",
    tags: ["programming", "professional", "learning", "modern", "legacy", "adaptation"]
  },

  // Specializations & Expertise
  {
    question: "What makes you unique as a developer?",
    answer: "I combine technical expertise with a strong focus on security and network engineering. My unique cross-functional experience includes CCNA certification for network troubleshooting, cybersecurity expertise with multiple Cisco certifications, and the ability to bridge the gap between software development and infrastructure. I've successfully migrated legacy mainframe systems to modern cloud-native architectures.",
    category: "expertise",
    tags: ["unique", "security", "network", "ccna", "cybersecurity", "infrastructure", "migration"]
  },
  {
    question: "What is your approach to problem-solving?",
    answer: "I'm a proactive problem-solver who leverages both technical skills and analytical thinking. My approach combines systematic debugging, performance optimization, and security-first design principles. I use tools like Wireshark for network analysis, implement comprehensive logging and monitoring, and always consider scalability and maintainability in my solutions.",
    category: "expertise",
    tags: ["problem-solving", "debugging", "optimization", "security", "wireshark", "monitoring"]
  },

  // Contact & Availability
  {
    question: "How can I contact you?",
    answer: "You can reach me at vsivareddy.venna@gmail.com or call me at +91 93989 61541. I'm also available on LinkedIn at linkedin.com/in/sivavenna. You can check out my projects on GitHub or use the contact form on this website. I'm always open to discussing new opportunities, collaborations, and technical discussions!",
    category: "contact",
    tags: ["contact", "email", "phone", "linkedin", "github", "opportunities"]
  },
  {
    question: "Are you available for work?",
    answer: "While I'm currently employed at Cisco Systems as a Software Engineer, I'm always interested in discussing exciting opportunities, consulting projects, or collaborative ventures. Feel free to reach out to discuss potential partnerships or future opportunities!",
    category: "contact",
    tags: ["availability", "cisco", "opportunities", "consulting", "partnerships"]
  },
  {
    question: "What are your social media links?",
    answer: "You can find me on LinkedIn at linkedin.com/in/sivavenna for professional networking, and check out my code repositories and projects on GitHub. I'm active in the tech community and enjoy connecting with fellow developers and engineers.",
    category: "contact",
    tags: ["social media", "linkedin", "github", "networking", "community"]
  },

  // Technical Interests & Future
  {
    question: "What are your current interests?",
    answer: "I'm currently focused on cloud-native technologies, particularly Kubernetes orchestration and GitOps workflows. I'm also exploring advanced cybersecurity practices, network automation, and the intersection of AI/ML with network operations. I'm passionate about building scalable, secure, and efficient systems.",
    category: "interests",
    tags: ["interests", "cloud-native", "kubernetes", "gitops", "cybersecurity", "automation", "ai"]
  },
  {
    question: "What are you learning currently?",
    answer: "I'm continuously expanding my expertise in cloud technologies, particularly advanced Kubernetes patterns, service mesh architectures, and infrastructure as code. I'm also diving deeper into cybersecurity frameworks, network automation with Python, and exploring how AI can enhance network operations and security monitoring.",
    category: "learning",
    tags: ["learning", "kubernetes", "service mesh", "infrastructure", "cybersecurity", "python", "ai"]
  },

  // Technical Details & Methodologies
  {
    question: "Do you work with APIs?",
    answer: "Absolutely! I have extensive experience building and consuming APIs. At Cisco, I develop Java Spring Boot microservices with both REST and SOAP APIs. I focus on creating well-documented, scalable, and secure API solutions with proper authentication, rate limiting, and comprehensive error handling. I also integrate with third-party services and implement API versioning strategies.",
    category: "skills",
    tags: ["api", "rest", "soap", "spring boot", "microservices", "authentication", "integration"]
  },
  {
    question: "What development methodologies do you follow?",
    answer: "I follow Agile development practices with a focus on DevOps and GitOps workflows. At Cisco, I implement CI/CD pipelines, use Helm for Kubernetes deployments, and practice infrastructure as code. I believe in test-driven development, code reviews, comprehensive documentation, and continuous integration for maintaining high-quality, reliable software.",
    category: "methodology",
    tags: ["agile", "devops", "gitops", "cicd", "helm", "kubernetes", "testing", "documentation"]
  },
  {
    question: "How do you handle security in your applications?",
    answer: "Security is a core focus in all my projects. I implement Single Sign-On (SSO) using Duo, follow secure coding practices to prevent SQL injection and XSS attacks, use proper authentication and authorization mechanisms, implement TLS encryption, and conduct regular security audits. My cybersecurity certifications (CCCA) help me maintain security-first design principles.",
    category: "security",
    tags: ["security", "sso", "duo", "authentication", "encryption", "ccca", "secure coding"]
  },
  {
    question: "What tools do you use for development?",
    answer: "I use a comprehensive set of development tools including IDEs (IntelliJ IDEA, VS Code), version control (Git, GitHub), containerization (Docker, Kubernetes), monitoring (Prometheus, Grafana), network analysis (Wireshark), database management tools, and various CLI tools for automation and debugging. I also use Jira for project management and collaboration.",
    category: "tools",
    tags: ["tools", "ide", "git", "docker", "kubernetes", "monitoring", "wireshark", "jira"]
  },

  // Industry & Domain Knowledge
  {
    question: "What industries have you worked in?",
    answer: "I have experience in multiple industries: telecommunications and networking (current role at Cisco Systems), financial services (mainframe banking applications at Cognizant), and enterprise software development. This diverse experience gives me a broad perspective on different business requirements and technical challenges.",
    category: "industry",
    tags: ["telecommunications", "networking", "cisco", "financial", "banking", "enterprise"]
  },
  {
    question: "Do you have experience with legacy systems?",
    answer: "Yes! At Cognizant, I worked extensively with mainframe banking applications, developing and modifying COBOL programs, optimizing batch processing jobs using JCL, and working with DB2 and VSAM technologies. This experience in legacy systems helps me understand migration challenges and bridge the gap between old and new technologies.",
    category: "legacy",
    tags: ["legacy", "mainframe", "cobol", "jcl", "db2", "vsam", "migration", "banking"]
  },

  // Additional Technical Questions
  {
    question: "What is your experience with microservices?",
    answer: "I have hands-on experience developing microservices at Cisco Systems using Java Spring Boot. I work with containerized microservices deployed on Kubernetes, implement service-to-service communication with REST and SOAP APIs, handle distributed system challenges, and use Helm charts for deployment management. I also implement monitoring and logging across microservices.",
    category: "architecture",
    tags: ["microservices", "spring boot", "kubernetes", "distributed systems", "helm"]
  },
  {
    question: "Do you have experience with data analytics?",
    answer: "Yes! I developed a data analytics tool at Cisco by integrating with Jira APIs to pull, model, and visualize project data. This tool enables predictive insights into team productivity and project progress. I have experience with data modeling, API integration, and creating meaningful visualizations for business intelligence.",
    category: "analytics",
    tags: ["data analytics", "jira api", "data modeling", "visualization", "business intelligence"]
  },
  {
    question: "What is your experience with network engineering?",
    answer: "I have a strong network engineering background with CCNA certification. I collaborate with network engineering teams on troubleshooting and configuring network devices, understand TCP/IP protocols deeply, perform packet analysis using Wireshark, and bridge the gap between software development and network infrastructure. This unique combination helps me build network-aware applications.",
    category: "networking",
    tags: ["network engineering", "ccna", "tcp/ip", "wireshark", "network devices", "infrastructure"]
  },
  {
    question: "How do you approach system migration projects?",
    answer: "I have extensive experience in system migration, particularly from legacy to modern architectures. At Cisco, I led the migration of IoT Control Center from Docker to Kubernetes. My approach includes thorough analysis of existing systems, careful planning of migration phases, implementing proper testing strategies, ensuring zero-downtime deployments, and providing comprehensive documentation and training.",
    category: "migration",
    tags: ["system migration", "legacy", "kubernetes", "docker", "zero-downtime", "planning"]
  },
  {
    question: "What is your experience with automation?",
    answer: "Automation is a key focus in my work. I've built network automation tools using Python for device discovery and configuration management, implemented GitOps workflows with FluxCD for automated deployments, created batch processing automation with JCL, and developed CI/CD pipelines. I believe in automating repetitive tasks to improve efficiency and reduce human error.",
    category: "automation",
    tags: ["automation", "python", "network automation", "gitops", "fluxcd", "cicd"]
  },
  {
    question: "What soft skills do you bring to a team?",
    answer: "I bring strong collaboration skills, having worked effectively with cross-functional teams including network engineers, security specialists, and frontend developers. I'm a proactive communicator, enjoy mentoring and knowledge sharing, adapt quickly to new technologies and requirements, and have experience working in both startup-like environments and large enterprise settings like Cisco.",
    category: "soft skills",
    tags: ["collaboration", "communication", "mentoring", "adaptability", "cross-functional"]
  },
  {
    question: "What are your career goals?",
    answer: "My career goals focus on becoming a technical leader in cloud-native architectures and cybersecurity. I want to continue developing expertise in Kubernetes, security automation, and network programmability. I'm interested in roles that combine my software engineering skills with my network and security background, potentially leading teams in building secure, scalable, and innovative solutions.",
    category: "career",
    tags: ["career goals", "technical leadership", "cloud-native", "cybersecurity", "innovation"]
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await QA.deleteMany({});
    console.log('🗑️  Cleared existing Q&A data');
    
    // Insert sample data
    const insertedData = await QA.insertMany(sampleQAData);
    console.log(`✅ Successfully inserted ${insertedData.length} Q&A pairs`);
    
    // Create text indexes (this will happen automatically, but we can ensure it)
    await QA.collection.createIndex({ 
      question: 'text', 
      answer: 'text',
      tags: 'text' 
    }, {
      weights: {
        question: 10,
        answer: 5,
        tags: 3
      },
      name: 'qa_text_index'
    });
    console.log('📊 Text indexes created successfully');
    
    console.log('🎉 Database seeding completed!');
    return insertedData;
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
