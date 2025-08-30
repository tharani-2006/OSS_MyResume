# 🧪 Localhost Testing Guide

Quick guide to test the chatbot API on your local machine before deployment.

## 🚀 Quick Start (3 Steps)

### Step 1: Start MongoDB
**Option A: MongoDB Compass (Recommended)**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and start it
3. Connect to `mongodb://localhost:27017`

**Option B: Command Line**
```bash
# If MongoDB is installed
mongod
```

### Step 2: Start the Project
```bash
# Automated startup (checks MongoDB, offers seeding, starts server)
npm run start-localhost

# OR manual steps:
npm run seed          # Add sample data
npm run dev          # Start server
```

### Step 3: Test the API
```bash
# Run automated tests
npm run test-api

# OR test manually
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What technologies do you work with?"}'
```

## 🎯 Available Commands

```bash
# Quick setup and testing
npm run start-localhost    # Interactive startup with MongoDB check
npm run quick-test        # Seed database + run tests

# Individual commands
npm run seed              # Add 35+ Q&A pairs to database
npm run dev              # Start Next.js development server
npm run test-api         # Test all API endpoints

# Check specific endpoints
curl http://localhost:3000/api/health     # Health check
curl http://localhost:3000/api/chat       # API info (GET)
```

## 📡 API Endpoints (Localhost)

- **Chat**: `http://localhost:3000/api/chat`
- **Add Q&A**: `http://localhost:3000/api/add`
- **Health Check**: `http://localhost:3000/api/health`

## 🧪 Sample Test Questions

Try these questions to test the chatbot:

```bash
# Personal information
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "Who are you?"}'

# Technical skills
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "What technologies do you work with?"}'

# Current job
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "Where do you work?"}'

# Projects
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "Tell me about your Network Automation project"}'

# Certifications
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "What certifications do you have?"}'

# Contact
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"question": "How can I contact you?"}'
```

## 🔧 Configuration

### Current Setup (Localhost)
- **Database**: `mongodb://localhost:27017/chatbot`
- **Server**: `http://localhost:3000`
- **Environment**: Development

### For Production Deployment
When ready to deploy, update these files:

1. **Environment Variables** (`.env`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
NODE_ENV=production
```

2. **Config File** (`config.js`):
```javascript
// Change baseUrl to your production domain
baseUrl: 'https://your-domain.vercel.app',
```

3. **Test Script** (`test-chatbot-api.js`):
```bash
# Test against production
API_BASE_URL=https://your-domain.vercel.app npm run test-api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows:
tasklist | findstr mongod

# Mac/Linux:
ps aux | grep mongod

# Start MongoDB manually
mongod --dbpath /path/to/data
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Database Empty
```bash
# Reseed database
npm run seed
```

### API Not Responding
1. Check if server is running: `http://localhost:3000/api/health`
2. Check MongoDB connection
3. Check console for errors

## ✅ Success Indicators

You'll know everything is working when:
- ✅ MongoDB connects successfully
- ✅ Database has 35+ Q&A pairs
- ✅ Server starts on `http://localhost:3000`
- ✅ Health check returns `{"status": "healthy"}`
- ✅ Chat API returns relevant answers
- ✅ Test script passes all checks

## 📦 What's Included

The localhost setup includes:
- **35+ Q&A pairs** about Siva Reddy's background
- **Smart question matching** with confidence scoring
- **Fallback responses** for unknown questions
- **Health monitoring** endpoint
- **Comprehensive testing** script
- **Easy configuration** switching

Ready to test! 🚀
