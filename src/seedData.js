import connectDB from './db.js';
import QA from './models/qa.model.js';

const sampleQAData = [
  // Skills & Technologies
  {
    question: "What technologies do you work with?",
    answer: "I specialize in backend development with Node.js and Python, database management with PostgreSQL and MongoDB, and frontend development with React and Next.js. I also have extensive experience in cybersecurity and network security.",
    category: "skills",
    tags: ["technologies", "skills", "programming", "backend", "frontend"]
  },
  {
    question: "What programming languages do you know?",
    answer: "I'm proficient in JavaScript/TypeScript, Python, Java, and have experience with C++ and SQL. I focus on modern web technologies and backend development.",
    category: "skills",
    tags: ["programming", "languages", "javascript", "python", "java"]
  },
  {
    question: "Do you have experience with databases?",
    answer: "Yes! I have extensive experience with both SQL databases (PostgreSQL, MySQL) and NoSQL databases (MongoDB). I'm skilled in database design, optimization, and management.",
    category: "skills",
    tags: ["database", "sql", "nosql", "postgresql", "mongodb"]
  },

  // Projects
  {
    question: "Tell me about your projects",
    answer: "I've worked on several exciting projects including: 📊 This interactive portfolio website, 🔒 A security dashboard for network monitoring, 🌐 A full-stack e-commerce platform, and 📚 A library management system. Each project showcases different aspects of my technical skills.",
    category: "projects",
    tags: ["projects", "portfolio", "security", "ecommerce", "fullstack"]
  },
  {
    question: "What is your portfolio website built with?",
    answer: "This portfolio is built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion for animations. It features a responsive design, dark/light theme, and is deployed on Vercel.",
    category: "projects",
    tags: ["portfolio", "nextjs", "typescript", "tailwind", "vercel"]
  },
  {
    question: "Do you have any security projects?",
    answer: "Yes! I've developed a comprehensive security dashboard that monitors network traffic, detects anomalies, and provides real-time alerts. It includes features like intrusion detection, vulnerability scanning, and security reporting.",
    category: "projects",
    tags: ["security", "cybersecurity", "monitoring", "network", "dashboard"]
  },

  // Experience
  {
    question: "What is your experience?",
    answer: "I have experience in full-stack web development, cybersecurity, and network administration. I've worked on various projects ranging from small business websites to enterprise-level security systems.",
    category: "experience",
    tags: ["experience", "fullstack", "cybersecurity", "network", "enterprise"]
  },
  {
    question: "How long have you been programming?",
    answer: "I've been programming for several years, starting with basic web development and gradually expanding into backend systems, databases, and cybersecurity. I'm constantly learning new technologies and best practices.",
    category: "experience",
    tags: ["experience", "programming", "learning", "development"]
  },

  // Contact & General
  {
    question: "How can I contact you?",
    answer: "You can reach out to me through the contact form on this website, connect with me on LinkedIn, or check out my projects on GitHub. I'm always open to discussing new opportunities and collaborations!",
    category: "contact",
    tags: ["contact", "linkedin", "github", "opportunities", "collaboration"]
  },
  {
    question: "Are you available for work?",
    answer: "Yes, I'm open to new opportunities! Whether it's full-time positions, freelance projects, or consulting work, I'd love to discuss how I can contribute to your team or project.",
    category: "contact",
    tags: ["work", "opportunities", "freelance", "consulting", "hiring"]
  },
  {
    question: "What makes you different?",
    answer: "I combine technical expertise with a strong focus on security and user experience. My background in both development and cybersecurity allows me to build robust, secure applications while maintaining clean, efficient code.",
    category: "general",
    tags: ["unique", "security", "development", "expertise", "experience"]
  },

  // Technical Details
  {
    question: "Do you work with APIs?",
    answer: "Absolutely! I have extensive experience building RESTful APIs, GraphQL endpoints, and integrating third-party services. I focus on creating well-documented, scalable, and secure API solutions.",
    category: "skills",
    tags: ["api", "rest", "graphql", "integration", "backend"]
  },
  {
    question: "What about cloud technologies?",
    answer: "I work with various cloud platforms including AWS, Google Cloud, and Azure. I have experience with containerization using Docker, serverless functions, and cloud database management.",
    category: "skills",
    tags: ["cloud", "aws", "azure", "docker", "serverless"]
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
