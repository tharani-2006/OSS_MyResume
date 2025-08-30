import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Production configuration with MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable for MongoDB Atlas connection');
}

// Log connection type (without exposing credentials)
const isAtlas = MONGODB_URI.includes('mongodb+srv://');
const isLocal = MONGODB_URI.includes('localhost');
console.log(`🔗 Connecting to MongoDB: ${isAtlas ? 'MongoDB Atlas' : isLocal ? 'localhost:27017' : 'Custom MongoDB'}`);

if (!isAtlas && !isLocal) {
  console.log('⚠️  Using custom MongoDB connection');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Atlas connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
