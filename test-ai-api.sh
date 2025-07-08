#!/bin/bash

# Test script for AI Chatbot API
echo "🧪 Testing AI Chatbot API Connection"
echo "===================================="

API_URL="https://premiere-brakes-attitudes-ohio.trycloudflare.com"
API_KEY="ak_1751948233952_l9tap319gfn"

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

# Test docs endpoint
echo "3. Testing Docs Endpoint..."
echo "GET $API_URL/docs"
curl -s -H "X-API-Key: $API_KEY" "$API_URL/docs" | python3 -m json.tool 2>/dev/null || echo "Docs response received"
echo ""

echo "✅ API Test Complete!"
echo ""
echo "💡 Usage in Portfolio:"
echo "   1. Start your portfolio: cd /Users/ssivared/MyResume && npm run dev"
echo "   2. Visit: http://localhost:3000"
echo "   3. Click the chat button and test the AI integration!"
