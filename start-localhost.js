#!/usr/bin/env node

// Startup script for localhost testing
// This script will check MongoDB connection and start the development server

import { exec } from 'child_process';
import { promisify } from 'util';
import mongoose from 'mongoose';

const execAsync = promisify(exec);

console.log('🚀 Starting Chatbot API for Localhost Testing\n');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot';
const PORT = process.env.PORT || 3000;

async function checkMongoDB() {
  console.log('📊 Checking MongoDB connection...');
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`   Connected to: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB (localhost:27017)' : 'MongoDB Atlas'}`);
    
    // Check if we have data
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasQACollection = collections.some(col => col.name === 'qas');
    
    if (hasQACollection) {
      const count = await mongoose.connection.db.collection('qas').countDocuments();
      console.log(`   Found ${count} Q&A pairs in database`);
      
      if (count === 0) {
        console.log('⚠️  Database is empty. Run "npm run seed" to add sample data.');
      }
    } else {
      console.log('⚠️  No Q&A collection found. Run "npm run seed" to create and populate database.');
    }
    
    await mongoose.disconnect();
    return true;
    
  } catch (error) {
    console.log('❌ MongoDB connection failed!');
    console.log('   Error:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Make sure MongoDB is running locally');
    console.log('   2. Install MongoDB Compass: https://www.mongodb.com/products/compass');
    console.log('   3. Or start MongoDB service: mongod');
    console.log('   4. Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env');
    return false;
  }
}

async function seedDatabase() {
  console.log('\n🌱 Seeding database with sample data...');
  
  try {
    const { stdout, stderr } = await execAsync('npm run seed');
    console.log(stdout);
    if (stderr) console.log('Warnings:', stderr);
    return true;
  } catch (error) {
    console.log('❌ Seeding failed:', error.message);
    return false;
  }
}

async function startServer() {
  console.log(`\n🚀 Starting development server on http://localhost:${PORT}`);
  console.log('📡 API Endpoints:');
  console.log(`   • Chat: http://localhost:${PORT}/api/chat`);
  console.log(`   • Add Q&A: http://localhost:${PORT}/api/add`);
  console.log(`   • Health: http://localhost:${PORT}/api/health`);
  console.log('\n🧪 Test the API:');
  console.log('   npm run test-api');
  console.log('\n⏹️  Stop server: Ctrl+C\n');
  
  // Start the Next.js development server
  const child = exec('npm run dev');
  
  child.stdout.on('data', (data) => {
    console.log(data);
  });
  
  child.stderr.on('data', (data) => {
    console.error(data);
  });
  
  child.on('close', (code) => {
    console.log(`\n👋 Server stopped with code ${code}`);
  });
}

async function main() {
  // Step 1: Check MongoDB connection
  const mongoConnected = await checkMongoDB();
  
  if (!mongoConnected) {
    console.log('\n❌ Cannot start server without MongoDB connection.');
    console.log('Please fix MongoDB connection and try again.');
    process.exit(1);
  }
  
  // Step 2: Ask if user wants to seed database
  console.log('\n❓ Do you want to seed the database with sample data?');
  console.log('   (This will clear existing data and add 35+ Q&A pairs)');
  console.log('   Press Enter to skip, or type "yes" to seed:');
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', async () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      const input = chunk.trim().toLowerCase();
      
      if (input === 'yes' || input === 'y') {
        const seeded = await seedDatabase();
        if (!seeded) {
          console.log('⚠️  Seeding failed, but continuing with server startup...');
        }
      }
      
      // Step 3: Start the server
      await startServer();
    }
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

main().catch(console.error);
