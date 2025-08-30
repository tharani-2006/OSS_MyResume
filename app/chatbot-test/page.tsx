'use client';

import { useState } from 'react';

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  confidence?: string;
  timestamp: Date;
}

interface ApiResponse {
  success: boolean;
  answer: string;
  confidence: string;
  category: string;
  suggestions?: string[];
  alternatives?: Array<{ question: string; answer: string }>;
}

export default function ChatbotTest() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      message: '👋 Hi! I\'m ready to answer questions about Siva Reddy\'s background, skills, projects, and experience. Ask me anything!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const quickQuestions = [
    'Who are you?',
    'What technologies do you work with?',
    'Where do you work?',
    'Tell me about your projects',
    'What certifications do you have?',
    'How can I contact you?',
    'Random question that won\'t match'
  ];

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      type: 'user',
      message: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        // Add bot response
        const botMessage: ChatMessage = {
          type: 'bot',
          message: data.answer,
          confidence: data.confidence,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        // Update stats
        setStats(prev => ({
          total: prev.total + 1,
          high: prev.high + (data.confidence === 'high' ? 1 : 0),
          medium: prev.medium + (data.confidence === 'medium' ? 1 : 0),
          low: prev.low + (data.confidence === 'low' ? 1 : 0)
        }));

        // Add suggestions if available
        if (data.suggestions && data.suggestions.length > 0) {
          const suggestionMessage: ChatMessage = {
            type: 'bot',
            message: `💡 You might also ask: ${data.suggestions.slice(0, 2).join(', ')}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }
      } else {
        const errorMessage: ChatMessage = {
          type: 'bot',
          message: `❌ Error: ${data.answer || 'Something went wrong'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        type: 'bot',
        message: `❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const getConfidenceBadge = (confidence?: string) => {
    if (!confidence) return null;
    
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ml-2 ${colors[confidence as keyof typeof colors]}`}>
        {confidence.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">🤖 Chatbot API Test Interface</h1>
            <p className="text-blue-100">Test the chatbot responses about Venna Venkata Siva Reddy</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Chat Section */}
            <div className="lg:col-span-2">
              {/* Messages */}
              <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.message}
                      {msg.confidence && getConfidenceBadge(msg.confidence)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-left">
                    <div className="inline-block bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                      🤔 Thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about Siva's skills, projects, experience..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>

              {/* Quick Questions */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">💡 Quick Test Questions:</h3>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
                      disabled={loading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              {/* Response Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">📈 Response Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Confidence:</span>
                    <span className="font-semibold text-green-600">{stats.high}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Confidence:</span>
                    <span className="font-semibold text-yellow-600">{stats.medium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Confidence:</span>
                    <span className="font-semibold text-red-600">{stats.low}</span>
                  </div>
                </div>
              </div>

              {/* Test Coverage */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">🎯 Test Coverage</h3>
                <div className="space-y-1 text-sm">
                  <div>✅ Personal Information</div>
                  <div>✅ Current Job (Cisco)</div>
                  <div>✅ Technical Skills</div>
                  <div>✅ Projects</div>
                  <div>✅ Certifications</div>
                  <div>✅ Contact Info</div>
                  <div>✅ Fallback Responses</div>
                </div>
              </div>

              {/* API Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">🔗 API Endpoints</h3>
                <div className="space-y-1 text-xs">
                  <div><strong>Chat:</strong> POST /api/chat</div>
                  <div><strong>Add Q&A:</strong> POST /api/add</div>
                  <div><strong>Health:</strong> GET /api/health</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
