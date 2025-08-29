import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../src/db.js';
import QA from '../../../src/models/qa.model.js';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { question, limit = 1 } = body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    let results = [];

    try {
      // First, try text search (requires text index)
      results = await QA.searchQuestions(trimmedQuestion, limit);
      
      // If no results from text search, try regex search as fallback
      if (results.length === 0) {
        results = await QA.regexSearch(trimmedQuestion, limit);
      }
    } catch (textSearchError) {
      console.log('Text search failed, using regex fallback:', textSearchError.message);
      // Fallback to regex search if text index doesn't exist yet
      results = await QA.regexSearch(trimmedQuestion, limit);
    }

    // If we found results, return the best match
    if (results.length > 0) {
      const bestMatch = results[0];
      return NextResponse.json({
        success: true,
        answer: bestMatch.answer,
        question: bestMatch.question,
        category: bestMatch.category,
        confidence: results.length > 0 ? 'high' : 'medium',
        matchedQuestion: bestMatch.question,
        alternatives: results.slice(1).map(r => ({
          question: r.question,
          answer: r.answer,
          category: r.category
        }))
      });
    }

    // No match found - return fallback response
    return NextResponse.json({
      success: true,
      answer: "I'm sorry, I don't have information about that specific topic. Could you please rephrase your question or ask about my skills, experience, or projects? You can also use the contact form to reach out directly.",
      question: trimmedQuestion,
      category: 'fallback',
      confidence: 'low',
      matchedQuestion: null,
      alternatives: [],
      suggestions: [
        "What technologies do you work with?",
        "Tell me about your projects",
        "What is your experience?",
        "How can I contact you?"
      ]
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Chat API is working',
    usage: 'Send POST request with { "question": "your question here" }',
    endpoints: {
      chat: 'POST /api/chat',
      add: 'POST /api/add'
    }
  });
}
