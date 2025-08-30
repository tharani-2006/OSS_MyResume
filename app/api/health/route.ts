import { NextResponse } from 'next/server';
import connectDB from '../../../src/db.js';
import QA from '../../../src/models/qa.model.js';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Test database query
    const count = await QA.countDocuments();
    
    // Check if we have sample data
    const hasData = count > 0;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        qaCount: count,
        hasData
      },
      api: {
        chat: '/api/chat',
        add: '/api/add',
        health: '/api/health'
      },
      version: '1.0.0'
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection failed',
      database: {
        connected: false
      }
    }, { status: 503 });
  }
}
