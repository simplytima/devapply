const mongoose = require('mongoose');

// COPY THIS EXACT STRING (replace cluster0.vzjhscg with your actual one if different)
const MONGODB_URI = 'mongodb+srv://devapply_user:DevApply2024!@cluster0.vzjhscg.mongodb.net/devapply?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
  console.log('Testing connection to MongoDB Atlas...');
  console.log('Using URI:', MONGODB_URI.replace(/DevApply2024!/, '********')); // Hide password in logs
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
    
    // Try to create a test collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Successfully wrote to database!');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

test();