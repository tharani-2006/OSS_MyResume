# 🚀 Production Deployment Guide

Complete guide for deploying the chatbot API to production with MongoDB Atlas and Vercel.

## 📋 Pre-Deployment Checklist

### ✅ MongoDB Atlas Setup
1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Configure Database**
   - Create a database named `chatbot`
   - Create a database user with read/write permissions
   - Add your IP address to the IP Access List (or use 0.0.0.0/0 for all IPs)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority`

### ✅ Vercel Setup
1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Get Vercel Tokens**
   - Go to Settings → Tokens
   - Create a new token
   - Copy the token for GitHub secrets

## 🔧 GitHub Repository Setup

### 1. Environment Variables (GitHub Secrets)
Add these secrets in your GitHub repository:
- Go to Settings → Secrets and variables → Actions
- Add the following secrets:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### 2. Vercel Project Setup
1. Import your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

## 🚀 Deployment Process

### Automatic Deployment (Recommended)
1. **Push to main branch** - Triggers production deployment
2. **Create Pull Request** - Triggers preview deployment
3. **GitHub Actions** will automatically:
   - Install dependencies
   - Run type checking and linting
   - Build the project
   - Deploy to Vercel

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 📊 Post-Deployment Setup

### 1. Seed Production Database
```bash
# Set environment variable
export MONGODB_URI="your_atlas_connection_string"

# Run production seeding
npm run seed-production
```

### 2. Test Production API
```bash
# Update test script for production
export API_BASE_URL="https://your-domain.vercel.app"
npm run test-api
```

### 3. Verify Deployment
- ✅ Visit `https://your-domain.vercel.app/api/health`
- ✅ Should return `{"status": "healthy"}`
- ✅ Database should show 35+ Q&A pairs

## 🧪 Testing Production

### API Endpoints
```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Test chat
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What technologies do you work with?"}'

# Add new Q&A
curl -X POST https://your-domain.vercel.app/api/add \
  -H "Content-Type: application/json" \
  -d '{"question": "Test question?", "answer": "Test answer"}'
```

### Sample Questions to Test
- "Who are you?"
- "What technologies do you work with?"
- "Where do you work?"
- "Tell me about your projects"
- "What certifications do you have?"
- "How can I contact you?"

## 📈 Monitoring & Maintenance

### Vercel Dashboard
- Monitor function execution times
- Check error logs and analytics
- View deployment history

### MongoDB Atlas
- Monitor database performance
- Check connection metrics
- Review query performance

### GitHub Actions
- View deployment logs
- Monitor build status
- Check automated tests

## 🔧 Configuration Files

### Key Files Updated for Production:
- ✅ `.env.example` - MongoDB Atlas configuration
- ✅ `vercel.json` - Optimized Vercel settings
- ✅ `.github/workflows/deploy.yml` - Auto-deployment workflow
- ✅ `src/db.js` - Production database connection
- ✅ `scripts/seed-production.js` - Production seeding script

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify database user permissions
   - Check IP whitelist in Atlas

2. **Vercel Deployment Failed**
   - Check build logs in Vercel dashboard
   - Verify environment variables
   - Check function timeout limits

3. **API Not Responding**
   - Check Vercel function logs
   - Verify MongoDB Atlas connection
   - Test health endpoint first

4. **Database Empty**
   - Run `npm run seed-production`
   - Check MongoDB Atlas collections
   - Verify seeding script logs

## ✅ Success Indicators

Your deployment is successful when:
- ✅ GitHub Actions workflow passes
- ✅ Vercel deployment completes
- ✅ Health endpoint returns healthy status
- ✅ Database contains 35+ Q&A pairs
- ✅ Chat API returns relevant responses
- ✅ All test questions work correctly

## 🎯 Performance Optimization

### Vercel Settings:
- ✅ Function timeout: 15 seconds
- ✅ Region: US East (iad1)
- ✅ Auto-aliasing enabled
- ✅ Connection caching implemented

### MongoDB Atlas:
- ✅ Text indexes for fast search
- ✅ Connection pooling
- ✅ Optimized queries
- ✅ Proper error handling

## 🔄 Continuous Deployment

The setup includes:
- ✅ **Auto-deployment** on main branch push
- ✅ **Preview deployments** for pull requests
- ✅ **Build validation** with type checking and linting
- ✅ **Environment-specific** configurations
- ✅ **Rollback capability** through Vercel dashboard

Your chatbot API is now production-ready with MongoDB Atlas and Vercel! 🎉
