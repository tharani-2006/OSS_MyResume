// Test script for chatbot API endpoints
// Usage:
//   Local: npm run test-api
//   Production: API_BASE_URL=https://your-domain.vercel.app npm run test-api

// Configuration - Automatically detects environment
const BASE_URL = process.env.API_BASE_URL ||
                 process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                 'http://localhost:3000';

const isProduction = BASE_URL.includes('vercel.app') || BASE_URL.includes('https://');
console.log(`🔗 Testing API at: ${BASE_URL}`);
console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Local Development'}`);

async function testAPI() {
  console.log('🧪 Testing Chatbot API Endpoints\n');

  // Test 1: Check if API is running
  console.log('1️⃣ Testing API availability...');
  try {
    const response = await fetch(`${BASE_URL}/api/chat`);
    const data = await response.json();
    console.log('✅ Chat API is running:', data.message);
  } catch (error) {
    console.log('❌ API not available. Make sure the server is running with: npm run dev');
    return;
  }

  // Test 2: Add a new Q&A pair
  console.log('\n2️⃣ Testing /api/add endpoint...');
  try {
    const addResponse = await fetch(`${BASE_URL}/api/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: "What is your favorite programming language?",
        answer: "I really enjoy working with JavaScript/TypeScript because of its versatility and the rich ecosystem. It allows me to work on both frontend and backend development seamlessly.",
        category: "preferences",
        tags: ["programming", "javascript", "typescript", "preferences"]
      })
    });

    const addData = await addResponse.json();
    if (addResponse.ok) {
      console.log('✅ Successfully added Q&A pair:', addData.data.question);
    } else {
      console.log('⚠️ Add response:', addData);
    }
  } catch (error) {
    console.log('❌ Error testing add endpoint:', error.message);
  }

  // Test 3: Test chat with various questions
  console.log('\n3️⃣ Testing /api/chat endpoint with different questions...');
  
  const testQuestions = [
    "What technologies do you work with?",
    "Tell me about your projects",
    "How can I contact you?",
    "Do you know Python?",
    "What is your experience with databases?",
    "Are you available for work?",
    "This is a completely random question that probably won't match anything"
  ];

  for (const question of testQuestions) {
    try {
      console.log(`\n🤔 Question: "${question}"`);
      
      const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      });

      const chatData = await chatResponse.json();
      
      if (chatResponse.ok) {
        console.log(`💬 Answer: "${chatData.answer.substring(0, 100)}${chatData.answer.length > 100 ? '...' : ''}"`);
        console.log(`🎯 Confidence: ${chatData.confidence}`);
        if (chatData.matchedQuestion) {
          console.log(`🔍 Matched: "${chatData.matchedQuestion}"`);
        }
        if (chatData.alternatives && chatData.alternatives.length > 0) {
          console.log(`📋 Alternatives: ${chatData.alternatives.length} found`);
        }
        if (chatData.suggestions && chatData.suggestions.length > 0) {
          console.log(`💡 Suggestions: ${chatData.suggestions.slice(0, 2).join(', ')}...`);
        }
      } else {
        console.log('❌ Chat error:', chatData);
      }
    } catch (error) {
      console.log('❌ Error testing chat:', error.message);
    }
  }

  // Test 4: Get all Q&A pairs
  console.log('\n4️⃣ Testing /api/add GET endpoint (retrieve Q&A pairs)...');
  try {
    const getResponse = await fetch(`${BASE_URL}/api/add?limit=5`);
    const getData = await getResponse.json();
    
    if (getResponse.ok) {
      console.log(`✅ Retrieved ${getData.data.length} Q&A pairs`);
      console.log(`📊 Total in database: ${getData.pagination.total}`);
      console.log('📝 Sample questions:');
      getData.data.slice(0, 3).forEach((qa, index) => {
        console.log(`   ${index + 1}. ${qa.question}`);
      });
    } else {
      console.log('❌ Get error:', getData);
    }
  } catch (error) {
    console.log('❌ Error testing get endpoint:', error.message);
  }

  // Test 5: Test error handling
  console.log('\n5️⃣ Testing error handling...');
  try {
    const errorResponse = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: "" }) // Empty question
    });

    const errorData = await errorResponse.json();
    if (errorResponse.status === 400) {
      console.log('✅ Error handling works:', errorData.error);
    } else {
      console.log('⚠️ Unexpected response:', errorData);
    }
  } catch (error) {
    console.log('❌ Error testing error handling:', error.message);
  }

  console.log('\n🎉 API testing completed!');
  console.log('\n📋 Summary:');
  console.log('- Chat endpoint: Answers questions with confidence scoring');
  console.log('- Add endpoint: Adds new Q&A pairs with validation');
  console.log('- Text search: Uses MongoDB text indexing for better matching');
  console.log('- Fallback: Provides helpful responses when no match found');
  console.log('- Error handling: Validates input and provides meaningful errors');
}

// Run the tests
testAPI().catch(console.error);
