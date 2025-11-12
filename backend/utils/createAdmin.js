const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-e', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shop-e.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('\n📝 Admin Credentials:');
      console.log('   Email: admin@shop-e.com');
      console.log('   Password: admin123');
      console.log('\nIf you need to reset the password, delete this user first.\n');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shop-e.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      status: 'active',
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('   Email: admin@shop-e.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();

