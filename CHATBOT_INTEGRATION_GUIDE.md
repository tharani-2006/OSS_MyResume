# 🤖 Chatbot Integration Guide

How to integrate the chatbot API into your existing portfolio website.

## 🎯 Integration Options

### Option 1: Floating Chat Widget (Recommended)
Add a floating chat bubble that expands into a chat interface.

### Option 2: Dedicated Chat Page
Create a separate page for chatbot interactions (already created at `/chatbot-test`).

### Option 3: Inline Chat Section
Add a chat section to your existing About or Contact page.

## 🚀 Quick Integration - Floating Chat Widget

### 1. Create Chat Component

Create `app/components/ChatWidget.tsx`:

```tsx
'use client';

import { useState } from 'react';

interface Message {
  type: 'user' | 'bot';
  text: string;
  confidence?: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hi! Ask me about Siva\'s background, skills, or projects!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: data.answer, 
          confidence: data.confidence 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Connection error. Please check your internet connection.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">Ask about Siva Reddy</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${msg.type === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                  {msg.confidence && (
                    <span className={`ml-2 px-1 py-0.5 rounded text-xs ${
                      msg.confidence === 'high' ? 'bg-green-200 text-green-800' :
                      msg.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {msg.confidence}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask me anything..."
                className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### 2. Add to Layout

Add the chat widget to your main layout (`app/layout.tsx`):

```tsx
import ChatWidget from './components/ChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
```

## 🎨 Styling Options

### Match Your Theme
Customize the colors to match your portfolio theme:

```tsx
// Dark theme example
const darkTheme = {
  bubble: 'bg-gray-800 hover:bg-gray-700',
  header: 'bg-gray-800',
  userMessage: 'bg-blue-600',
  botMessage: 'bg-gray-700 text-white',
  window: 'bg-gray-900 border-gray-700'
};

// Cyber theme example (matching your portfolio)
const cyberTheme = {
  bubble: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  header: 'bg-gradient-to-r from-cyan-600 to-blue-600',
  userMessage: 'bg-cyan-500',
  botMessage: 'bg-gray-800 border border-cyan-400 text-cyan-100',
  window: 'bg-gray-900 border border-cyan-400'
};
```

## 🔧 Advanced Features

### Add Quick Questions
```tsx
const quickQuestions = [
  'What technologies do you work with?',
  'Tell me about your projects',
  'What certifications do you have?',
  'How can I contact you?'
];

// Add to chat window
<div className="p-2 border-t">
  <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
  <div className="flex flex-wrap gap-1">
    {quickQuestions.map((q, i) => (
      <button
        key={i}
        onClick={() => sendMessage(q)}
        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
      >
        {q}
      </button>
    ))}
  </div>
</div>
```

### Add Typing Indicator
```tsx
const [isTyping, setIsTyping] = useState(false);

// In sendMessage function
setIsTyping(true);
// ... API call
setIsTyping(false);

// In messages display
{isTyping && (
  <div className="text-left">
    <div className="inline-block bg-gray-100 px-3 py-2 rounded-lg">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
)}
```

## 📱 Mobile Optimization

### Responsive Design
```tsx
// Mobile-friendly chat window
<div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
```

### Touch-friendly Buttons
```tsx
// Larger touch targets for mobile
className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all"
```

## 🧪 Testing Your Integration

### 1. Test the Chat Widget
- Click the chat bubble
- Send a test message
- Verify responses appear correctly
- Test on mobile devices

### 2. Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Who are you?"}'
```

### 3. Use the Test Page
Visit `/chatbot-test` to use the comprehensive test interface.

## 🚀 Production Deployment

### 1. Environment Variables
Set in Vercel dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
NODE_ENV=production
```

### 2. Seed Production Database
```bash
npm run seed-production
```

### 3. Test Production
```bash
API_BASE_URL=https://your-domain.vercel.app npm run test-api
```

## 🎯 Best Practices

### Performance
- Lazy load the chat component
- Implement message pagination for long conversations
- Cache API responses when appropriate

### User Experience
- Show typing indicators
- Provide quick question suggestions
- Handle errors gracefully
- Make it easy to close/minimize

### Accessibility
- Add proper ARIA labels
- Ensure keyboard navigation works
- Provide alt text for icons
- Support screen readers

## 🔄 Maintenance

### Adding New Q&A Pairs
```bash
# Add via API
curl -X POST /api/add \
  -H "Content-Type: application/json" \
  -d '{"question": "New question?", "answer": "New answer", "category": "general"}'

# Or update seedData.js and re-seed
npm run seed-production
```

### Monitoring
- Check `/api/health` regularly
- Monitor Vercel function logs
- Track user engagement metrics

---

**Your chatbot is now ready to engage visitors and showcase your technical capabilities!** 🤖✨
