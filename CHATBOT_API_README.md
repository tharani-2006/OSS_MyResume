# 🤖 Chatbot API Documentation

A lightweight, retrieval-based chatbot API built with Node.js, MongoDB, and Next.js API routes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB running locally (MongoDB Compass recommended)
- Next.js project setup

### Installation
Dependencies are already installed. If needed:
```bash
npm install mongoose dotenv
```

### Setup
1. **Start MongoDB** (using MongoDB Compass or command line)
2. **Create environment file** (optional - defaults to local MongoDB):
   ```bash
   cp .env.example .env
   ```
3. **Seed the database** with sample data:
   ```bash
   npm run seed
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### 1. Chat Endpoint
**POST** `/api/chat`

Ask questions and get intelligent responses.

**Request:**
```json
{
  "question": "What technologies do you work with?",
  "limit": 1
}
```

**Response:**
```json
{
  "success": true,
  "answer": "I specialize in backend development with Node.js and Python...",
  "question": "What technologies do you work with?",
  "category": "skills",
  "confidence": "high",
  "matchedQuestion": "What technologies do you work with?",
  "alternatives": []
}
```

### 2. Add Q&A Endpoint
**POST** `/api/add`

Add new question-answer pairs to the database.

**Request:**
```json
{
  "question": "What is your favorite framework?",
  "answer": "I really enjoy working with Next.js for full-stack development.",
  "category": "preferences",
  "tags": ["framework", "nextjs", "preferences"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Q&A pair added successfully",
  "data": {
    "id": "...",
    "question": "What is your favorite framework?",
    "answer": "I really enjoy working with Next.js...",
    "category": "preferences",
    "tags": ["framework", "nextjs", "preferences"],
    "createdAt": "2025-01-XX..."
  }
}
```

**GET** `/api/add`

Retrieve existing Q&A pairs with pagination.

**Query Parameters:**
- `category` - Filter by category
- `limit` - Number of results (default: 10)
- `page` - Page number (default: 1)

## 🧪 Testing

### Automated Testing
```bash
npm run test-api
```

### Manual Testing
1. **Start the server**: `npm run dev`
2. **Test chat endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"question": "What technologies do you work with?"}'
   ```

3. **Test add endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/add \
     -H "Content-Type: application/json" \
     -d '{"question": "Test question?", "answer": "Test answer"}'
   ```

## 🎯 Features

### Smart Question Matching
- **Text Search**: MongoDB full-text search with weighted scoring
- **Regex Fallback**: Pattern matching for broader question coverage
- **Confidence Scoring**: High/Medium/Low confidence levels
- **Alternative Suggestions**: Multiple relevant answers when available

### Data Management
- **Duplicate Prevention**: Automatic detection of similar questions
- **Categorization**: Organize Q&A pairs by topics
- **Tagging System**: Flexible tagging for better searchability
- **Pagination**: Efficient data retrieval for large datasets

### Error Handling
- **Input Validation**: Comprehensive request validation
- **Graceful Fallbacks**: Helpful responses when no match found
- **Development Debugging**: Detailed error messages in development mode

## 📊 Sample Data Categories

The seeded database includes **35+ comprehensive Q&A pairs** covering:

### 👤 Personal & Professional
- **Personal**: Name, location, contact information
- **Experience**: Current role at Cisco Systems, previous experience at Cognizant
- **Education**: Electronics & Telecommunication Engineering background
- **Contact**: Email, phone, LinkedIn, GitHub, availability

### 💻 Technical Expertise
- **Skills**: Java, Python, JavaScript/TypeScript, SQL, COBOL, Shell Scripting
- **Technologies**: Kubernetes, Docker, Spring Boot, React, PostgreSQL, MongoDB
- **Cloud**: AWS, GCP, CI/CD, Infrastructure as Code
- **Networking**: CCNA certified, TCP/IP, Wireshark, device configuration
- **Security**: CCCA certified, SSO implementation, secure coding practices

### 🚀 Projects & Implementations
- **Network Automation Toolkit**: Python/Flask with SNMP device management
- **Security Compliance Monitor**: FastAPI/React with vulnerability scanning
- **Library Management System**: PostgreSQL with advanced SQL features
- **Log Analysis System**: Java/Spring Boot with real-time processing
- **Portfolio Website**: Next.js/TypeScript with terminal interface

### 🏆 Certifications & Specializations
- **Cisco Certified DevNet Associate (DEVASC)**: Network programmability
- **Cisco Certified Network Associate (CCNA)**: Networking fundamentals
- **Cisco Certified Cybersecurity Associate (CCCA)**: Security expertise

### 🔧 Methodologies & Tools
- **Development**: Agile, DevOps, GitOps, Test-driven development
- **Tools**: IntelliJ IDEA, VS Code, Git, Docker, Kubernetes, Wireshark
- **Architecture**: Microservices, API design, system migration
- **Automation**: Network automation, CI/CD pipelines, infrastructure automation

## 🔧 Configuration

### Environment Variables
```env
# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/chatbot

# Production MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatbot

NODE_ENV=development
```

### Database Schema
```javascript
{
  question: String (required, indexed),
  answer: String (required),
  category: String (default: 'general'),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment
The API is optimized for Vercel with:
- Connection caching for serverless functions
- Lightweight dependencies
- ES modules support
- Environment variable configuration

### Production Checklist
- [ ] Set `MONGODB_URI` environment variable
- [ ] Set `NODE_ENV=production`
- [ ] Seed production database
- [ ] Test all endpoints
- [ ] Monitor performance and logs

## 🤝 Contributing

1. Add new sample Q&A pairs in `src/seedData.js`
2. Extend the schema in `src/models/qa.model.js`
3. Add new API endpoints in `app/api/`
4. Update tests in `test-chatbot-api.js`

## 📝 License

Open source project - feel free to use and modify!
