// Quick MongoDB connection test
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/chatbot';

console.log('🔍 Testing MongoDB connection...');
console.log(`📡 Connecting to: ${MONGODB_URI}`);

try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
  });
  
  console.log('✅ MongoDB connection successful!');
  console.log('📊 Database info:');
  console.log(`   - Database: ${mongoose.connection.name}`);
  console.log(`   - Host: ${mongoose.connection.host}`);
  console.log(`   - Port: ${mongoose.connection.port}`);
  
  // List collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`   - Collections: ${collections.length}`);
  
  if (collections.length > 0) {
    collections.forEach(col => {
      console.log(`     • ${col.name}`);
    });
  }
  
  await mongoose.disconnect();
  console.log('🎉 MongoDB is ready for the chatbot API!');
  
} catch (error) {
  console.log('❌ MongoDB connection failed!');
  console.log(`   Error: ${error.message}`);
  console.log('');
  console.log('💡 Solutions:');
  console.log('   1. Install MongoDB Compass: https://www.mongodb.com/products/compass');
  console.log('   2. Start MongoDB Compass and connect to localhost:27017');
  console.log('   3. Or install MongoDB Community Server');
  console.log('   4. Or use MongoDB Atlas (cloud database)');
  console.log('');
  console.log('🔧 Quick fix for Windows:');
  console.log('   - Download MongoDB Compass');
  console.log('   - Install and start it');
  console.log('   - Click "Connect" (default localhost:27017)');
  
  process.exit(1);
}
