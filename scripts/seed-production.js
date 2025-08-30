#!/usr/bin/env node

// Production seeding script for MongoDB Atlas
// Run this after deployment to populate the database

import { seedDatabase } from '../src/seedData.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🌱 Production Database Seeding');
console.log('==============================');

// Verify we have MongoDB Atlas URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.log('💡 Set your MongoDB Atlas connection string:');
  console.log('   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/chatbot"');
  process.exit(1);
}

if (!MONGODB_URI.includes('mongodb+srv://')) {
  console.log('⚠️  Warning: This doesn\'t look like a MongoDB Atlas URI');
  console.log('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/chatbot');
}

console.log('🔗 Connecting to MongoDB Atlas...');
console.log(`📊 Database: ${MONGODB_URI.split('@')[1]?.split('/')[0] || 'Unknown'}`);

try {
  await seedDatabase();
  console.log('');
  console.log('🎉 Production database seeded successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Test the API endpoints');
  console.log('   2. Verify chatbot responses');
  console.log('   3. Monitor application logs');
  console.log('');
  console.log('🔗 API Endpoints:');
  console.log('   • Chat: POST /api/chat');
  console.log('   • Add Q&A: POST /api/add');
  console.log('   • Health: GET /api/health');
  
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Check MongoDB Atlas connection string');
  console.log('   2. Verify database user permissions');
  console.log('   3. Check network access (IP whitelist)');
  console.log('   4. Ensure database exists');
  
  process.exit(1);
}
