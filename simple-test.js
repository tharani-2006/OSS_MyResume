// Simple test to verify everything works
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/chatbot';

console.log('🧪 Simple API Test');
console.log('==================');

// Test 1: MongoDB Connection
console.log('\n1️⃣ Testing MongoDB...');
try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ MongoDB connected successfully');
  
  // Test 2: Create a simple document
  console.log('\n2️⃣ Testing database operations...');
  
  const testSchema = new mongoose.Schema({
    question: String,
    answer: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  const TestModel = mongoose.models.Test || mongoose.model('Test', testSchema);
  
  // Clear any existing test data
  await TestModel.deleteMany({});
  
  // Insert test data
  const testDoc = new TestModel({
    question: "Test question?",
    answer: "Test answer!"
  });
  
  await testDoc.save();
  console.log('✅ Document saved successfully');
  
  // Retrieve test data
  const retrieved = await TestModel.findOne();
  console.log('✅ Document retrieved:', retrieved.question);
  
  // Clean up
  await TestModel.deleteMany({});
  console.log('✅ Test data cleaned up');
  
  await mongoose.disconnect();
  console.log('✅ MongoDB disconnected');
  
  console.log('\n🎉 All tests passed! MongoDB is working correctly.');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run dev (to start the server)');
  console.log('   2. Run: npm run seed (to add chatbot data)');
  console.log('   3. Run: npm run test-api (to test endpoints)');
  
} catch (error) {
  console.log('❌ Test failed:', error.message);
  console.log('\n💡 Make sure MongoDB is running:');
  console.log('   - Start MongoDB Compass');
  console.log('   - Connect to localhost:27017');
  process.exit(1);
}
