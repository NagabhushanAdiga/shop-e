/**
 * MongoDB Connection Test Script
 * Run this to verify your MongoDB Atlas connection
 * 
 * Usage: node test-mongodb.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('\n🔍 Testing MongoDB Connection...\n');
  console.log('Configuration:');
  console.log('- MongoDB URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Missing');
  console.log('- Database:', process.env.MONGODB_URI ? 'shop-e' : 'Not configured');
  console.log('\n⏳ Connecting...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ SUCCESS! MongoDB Connected');
    console.log('📊 Connection Details:');
    console.log('- Host:', mongoose.connection.host);
    console.log('- Database:', mongoose.connection.name);
    console.log('- State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📦 Collections in database:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('   (No collections yet - will be created when you add data)');
    }

    console.log('\n✨ Your MongoDB setup is working perfectly!\n');
    
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your MongoDB Atlas cluster is running');
    console.error('2. Verify IP whitelist includes 0.0.0.0/0');
    console.error('3. Check username and password are correct');
    console.error('4. Ensure .env file exists and is configured');
    console.error('\nFor help, see: MONGODB_SETUP_COMPLETE.md\n');
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testConnection();

