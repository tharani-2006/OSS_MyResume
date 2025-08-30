import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../src/db.js';
import QA from '../../../src/models/qa.model.js';
import type { AddQARequest, AddQAResponse } from '../../../types/chatbot.js';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { question, answer, category = 'general', tags = [] } = body;

    // Validate required fields
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== 'string') {
      return NextResponse.json(
        { error: 'Answer is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (trimmedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedAnswer.length === 0) {
      return NextResponse.json(
        { error: 'Answer cannot be empty' },
        { status: 400 }
      );
    }

    // Validate tags if provided
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }

    // Check for duplicate questions
    const existingQA = await QA.findOne({ 
      question: { $regex: new RegExp(`^${trimmedQuestion}$`, 'i') } 
    });

    if (existingQA) {
      return NextResponse.json(
        { 
          error: 'A similar question already exists',
          existingQuestion: existingQA.question,
          existingAnswer: existingQA.answer,
          suggestion: 'Consider updating the existing Q&A or rephrasing your question'
        },
        { status: 409 }
      );
    }

    // Create new Q&A entry
    const newQA = new QA({
      question: trimmedQuestion,
      answer: trimmedAnswer,
      category: category.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.toString().trim()).filter(tag => tag.length > 0) : []
    });

    // Save to database
    const savedQA = await newQA.save();

    return NextResponse.json({
      success: true,
      message: 'Q&A pair added successfully',
      data: {
        id: savedQA._id,
        question: savedQA.question,
        answer: savedQA.answer,
        category: savedQA.category,
        tags: savedQA.tags,
        createdAt: savedQA.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Add Q&A API error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve all Q&A pairs (for admin/testing purposes)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query = category ? { category } : {};

    // Get Q&A pairs with pagination
    const qaList = await QA.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QA.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: qaList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get Q&A API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}
