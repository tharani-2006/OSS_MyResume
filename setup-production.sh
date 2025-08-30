#!/bin/bash

# Production setup script for chatbot API
# Run this script to set up the production environment

echo "🚀 Chatbot API - Production Setup"
echo "=================================="
echo ""

# Check if MongoDB URI is provided
if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI environment variable is required"
    echo ""
    echo "💡 Please set your MongoDB Atlas connection string:"
    echo "   export MONGODB_URI=\"mongodb+srv://username:password@cluster.mongodb.net/chatbot\""
    echo ""
    echo "📋 Steps to get MongoDB Atlas URI:"
    echo "   1. Go to https://www.mongodb.com/atlas"
    echo "   2. Create a free cluster"
    echo "   3. Create a database user"
    echo "   4. Get connection string from 'Connect' button"
    echo ""
    exit 1
fi

echo "✅ MongoDB URI found"
echo "🔗 Connecting to: $(echo $MONGODB_URI | sed 's/mongodb+srv:\/\/[^@]*@/mongodb+srv://***@/')"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

echo "✅ Type check passed"
echo ""

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Seed the database
echo "🌱 Seeding production database..."
npm run seed-production

if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check MongoDB Atlas connection string"
    echo "   2. Verify database user permissions"
    echo "   3. Check network access (IP whitelist)"
    exit 1
fi

echo "✅ Database seeded successfully"
echo ""

# Test the API (if running locally)
if command -v curl &> /dev/null; then
    echo "🧪 Testing API endpoints..."
    
    # Start the server in background for testing
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test health endpoint
    HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
    if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check warning: $HEALTH_RESPONSE"
    fi
    
    # Test chat endpoint
    CHAT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat \
        -H "Content-Type: application/json" \
        -d '{"question": "Who are you?"}')
    
    if [[ $CHAT_RESPONSE == *"Siva Reddy"* ]]; then
        echo "✅ Chat endpoint working"
    else
        echo "⚠️  Chat endpoint warning: $CHAT_RESPONSE"
    fi
    
    # Stop the test server
    kill $SERVER_PID 2>/dev/null
    
    echo ""
fi

echo "🎉 Production setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy to Vercel: vercel --prod"
echo "   2. Or push to GitHub for auto-deployment"
echo "   3. Test production endpoints"
echo "   4. Monitor application logs"
echo ""
echo "🔗 Production endpoints:"
echo "   • Chat: POST /api/chat"
echo "   • Add Q&A: POST /api/add"
echo "   • Health: GET /api/health"
echo ""
echo "✨ Your chatbot API is ready for production! 🚀"
