const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop-e');
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shop-e.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      status: 'active',
    });
    console.log('✅ Created admin user');

    // Create sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1234567891',
      totalOrders: 5,
      totalSpent: 847.50,
    });
    console.log('✅ Created sample user');

    // Create categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
      active: true,
    });

    const fashion = await Category.create({
      name: 'Fashion',
      description: 'Clothing and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
      active: true,
    });

    const home = await Category.create({
      name: 'Home',
      description: 'Home and living products',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
      active: true,
    });

    const sports = await Category.create({
      name: 'Sports',
      description: 'Sports and fitness equipment',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80',
      active: true,
    });

    const accessories = await Category.create({
      name: 'Accessories',
      description: 'Various accessories',
      image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&q=80',
      active: true,
    });

    console.log('✅ Created categories');

    // Create products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
        price: 79.99,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        stock: 50,
        rating: 4.5,
        featured: true,
      },
      {
        name: 'Smart Watch',
        description: 'Advanced fitness tracker with heart rate monitoring and GPS.',
        price: 199.99,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        stock: 30,
        rating: 4.7,
        featured: true,
      },
      {
        name: 'Laptop Backpack',
        description: 'Water-resistant laptop backpack with multiple compartments.',
        price: 49.99,
        category: accessories._id,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        stock: 100,
        rating: 4.3,
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with superior cushioning and support.',
        price: 89.99,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        stock: 60,
        rating: 4.4,
      },
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe.',
        price: 129.99,
        category: home._id,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
        stock: 40,
        rating: 4.5,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with extra cushioning for comfort.',
        price: 29.99,
        category: sports._id,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
        stock: 120,
        rating: 4.2,
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Created products');

    // Update category product counts
    await Category.findByIdAndUpdate(electronics._id, { productCount: 2 });
    await Category.findByIdAndUpdate(fashion._id, { productCount: 1 });
    await Category.findByIdAndUpdate(home._id, { productCount: 1 });
    await Category.findByIdAndUpdate(sports._id, { productCount: 1 });
    await Category.findByIdAndUpdate(accessories._id, { productCount: 1 });

    console.log('✅ Updated category counts');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('   Email: admin@shop-e.com');
    console.log('   Password: admin123');
    console.log('\n📝 Sample User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

