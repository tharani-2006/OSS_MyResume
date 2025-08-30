# 🤖 Interactive Chatbot API

A lightweight, retrieval-based chatbot API that answers questions about **Venna Venkata Siva Reddy's** professional background, skills, projects, and experience.

## ✨ Features

- **🧠 Smart Question Matching** - Uses MongoDB text search with confidence scoring
- **📊 Comprehensive Knowledge Base** - 35+ Q&A pairs covering all aspects of professional profile
- **🔄 Fallback Responses** - Helpful suggestions when questions don't match
- **⚡ Production Ready** - Optimized for Vercel deployment with MongoDB Atlas
- **🔍 Health Monitoring** - Built-in health checks and API status endpoints
- **🧪 Automated Testing** - Complete test suite for all endpoints

## 🚀 Quick Start

### For Development
```bash
# Install dependencies
npm install

# Start MongoDB (MongoDB Compass recommended)
# Then seed the database
npm run seed

# Start development server
npm run dev

# Test the API
npm run test-api
```

### For Production
```bash
# Set MongoDB Atlas connection
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/chatbot"

# Seed production database
npm run seed-production

# Deploy to Vercel (auto-deployment via GitHub Actions)
git push origin main
```

## 📡 API Endpoints

### Chat Endpoint
**POST** `/api/chat`
```json
{
  "question": "What technologies do you work with?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "I specialize in Java, Python, JavaScript/TypeScript, Kubernetes, Docker...",
  "confidence": "high",
  "category": "skills",
  "alternatives": []
}
```

### Add Q&A Endpoint
**POST** `/api/add`
```json
{
  "question": "New question?",
  "answer": "New answer",
  "category": "general",
  "tags": ["tag1", "tag2"]
}
```

### Health Check
**GET** `/api/health`
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "qaCount": 35
  }
}
```

## 🎯 What the Chatbot Knows

### 👤 Personal & Professional
- Full name, location (Bengaluru, India)
- Contact information (email, phone, LinkedIn)
- Current role: Software Engineer at Cisco Systems
- Previous experience at Cognizant Technology Solutions
- Education: Electronics & Telecommunication Engineering

### 💻 Technical Skills
- **Languages**: Java, Python, JavaScript/TypeScript, SQL, COBOL
- **Cloud & DevOps**: Kubernetes, Docker, Helm, FluxCD, AWS, GCP
- **Backend**: Spring Boot, REST APIs, SOAP, Microservices
- **Frontend**: React, Next.js, HTML, CSS
- **Databases**: PostgreSQL, MongoDB, IBM DB2, VSAM
- **Networking**: TCP/IP, SNMP, Wireshark, device configuration

### 🚀 Projects
- **Network Automation Toolkit**: Python/Flask with SNMP device management
- **Security Compliance Monitor**: FastAPI/React with vulnerability scanning
- **Library Management System**: PostgreSQL with advanced SQL features
- **Log Analysis System**: Java/Spring Boot with real-time processing
- **Portfolio Website**: Next.js/TypeScript with terminal interface

### 🏆 Certifications
- Cisco Certified DevNet Associate (DEVASC)
- Cisco Certified Network Associate (CCNA)
- Cisco Certified Cybersecurity Associate (CCCA)

## 🧪 Testing

### Sample Questions
```bash
# Personal information
"Who are you?"
"Where are you located?"

# Current job
"Where do you work?"
"What do you do at Cisco?"

# Technical skills
"What technologies do you work with?"
"What programming languages do you know?"
"Do you have cloud experience?"

# Projects
"Tell me about your projects"
"What is your Network Automation Toolkit?"
"Tell me about your Security Monitor project"

# Certifications
"What certifications do you have?"
"Do you have networking certifications?"

# Contact
"How can I contact you?"
"Are you available for work?"
```

## 🔧 Configuration

### Environment Variables
```env
# MongoDB Atlas (Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot

# Application
NODE_ENV=production
PORT=3000
```

### Vercel Settings
- Function timeout: 15 seconds
- Auto-deployment on main branch
- Preview deployments for PRs
- Environment variables configured

## 📊 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js API   │───▶│   MongoDB       │───▶│   Chatbot       │
│   Routes        │    │   Atlas         │    │   Responses     │
│                 │    │                 │    │                 │
│ • /api/chat     │    │ • Text Search   │    │ • Smart Match   │
│ • /api/add      │    │ • 35+ Q&A pairs │    │ • Confidence    │
│ • /api/health   │    │ • Indexes       │    │ • Fallbacks     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)
- ✅ Triggers on push to main branch
- ✅ Runs type checking and linting
- ✅ Builds and deploys to Vercel
- ✅ Creates preview deployments for PRs

### Manual Deployment
```bash
# Using Vercel CLI
vercel --prod

# Or push to GitHub (auto-deployment)
git push origin main
```

## 📈 Performance

- **Response Time**: < 2 seconds average
- **Database**: Optimized with text indexes
- **Caching**: Connection pooling for serverless
- **Scalability**: Auto-scaling with Vercel
- **Monitoring**: Built-in health checks

## 🤝 Integration

### Frontend Integration Example
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: userQuestion })
});

const data = await response.json();
console.log(data.answer); // Display chatbot response
```

## 📝 Files Structure

```
├── app/api/
│   ├── chat/route.ts          # Main chat endpoint
│   ├── add/route.ts           # Q&A management
│   └── health/route.ts        # Health monitoring
├── src/
│   ├── db.js                  # MongoDB connection
│   ├── models/qa.model.js     # Q&A schema
│   └── seedData.js            # Sample data
├── scripts/
│   └── seed-production.js     # Production seeding
├── .github/workflows/
│   └── deploy.yml             # Auto-deployment
└── test-chatbot-api.js        # API testing
```

## 🎉 Ready for Production!

This chatbot API is production-ready with:
- ✅ MongoDB Atlas integration
- ✅ Vercel auto-deployment
- ✅ Comprehensive testing
- ✅ Health monitoring
- ✅ Error handling
- ✅ Performance optimization

Perfect for integration into any portfolio website! 🚀
