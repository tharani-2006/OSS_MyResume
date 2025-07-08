#!/bin/bash

# Test script for AI Chatbot API
echo "🧪 Testing AI Chatbot API Connection"
echo "===================================="

API_URL="https://reader-santa-accessories-scout.trycloudflare.com"
API_KEY="demo-api-key-12345"

echo "📡 API Base URL: $API_URL"
echo "🔑 API Key: $API_KEY"
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
echo "GET $API_URL/health"
curl -s -H "X-API-Key: $API_KEY" "$API_URL/health" | python3 -m json.tool 2>/dev/null || echo "Health check response received"
echo ""

# Test chat endpoint
echo "2. Testing Chat Endpoint..."
echo "POST $API_URL/api/chat/message"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "message": "What are your technical skills?",
    "sessionId": "test_session_123"
  }' \
  "$API_URL/api/chat/message" | python3 -m json.tool 2>/dev/null || echo "Chat response received"
echo ""

# Test starters endpoint
echo "3. Testing Starters Endpoint..."
echo "GET $API_URL/api/chat/starters"
curl -s -H "X-API-Key: $API_KEY" "$API_URL/api/chat/starters" | python3 -m json.tool 2>/dev/null || echo "Starters response received"
echo ""

# Test models endpoint
echo "4. Testing Models Endpoint..."
echo "GET $API_URL/api/chat/models"
curl -s -H "X-API-Key: $API_KEY" "$API_URL/api/chat/models" | python3 -m json.tool 2>/dev/null || echo "Models response received"
echo ""

# Test widget endpoint
echo "5. Testing Widget Endpoint..."
echo "GET $API_URL/widget"
curl -s -H "X-API-Key: $API_KEY" "$API_URL/widget" | head -20 || echo "Widget response received"
echo ""

echo "✅ API Test Complete!"
echo ""
echo "💡 Usage in Portfolio:"
echo "   1. Start your portfolio: cd /Users/ssivared/MyResume && npm run dev"
echo "   2. Visit: http://localhost:3000"
echo "   3. Click the chat button and test the AI integration!"
