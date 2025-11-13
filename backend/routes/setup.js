const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Setup initial admin user and sample data
// @route   POST /api/setup/init
// @access  Public (but should be protected in production)
router.post('/init', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shop-e.com' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Database is already initialized.',
      });
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

    // Check if categories exist, if not create them
    const categoryCount = await Category.countDocuments();
    
    if (categoryCount === 0) {
      const categories = [
        {
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
          active: true,
        },
        {
          name: 'Fashion',
          description: 'Clothing and accessories',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
          active: true,
        },
        {
          name: 'Home',
          description: 'Home and living products',
          image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
          active: true,
        },
        {
          name: 'Sports',
          description: 'Sports and fitness equipment',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80',
          active: true,
        },
        {
          name: 'Accessories',
          description: 'Various accessories',
          image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&q=80',
          active: true,
        },
      ];
      
      await Category.insertMany(categories);
    }

    res.status(201).json({
      success: true,
      message: 'Database initialized successfully',
      admin: {
        email: 'admin@shop-e.com',
        defaultPassword: 'admin123',
        warning: 'Please change the password after first login!'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Create admin user only
// @route   POST /api/setup/create-admin
// @access  Public (but should be protected in production)
router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shop-e.com' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists',
        credentials: {
          email: 'admin@shop-e.com',
          password: 'admin123 (if not changed)'
        }
      });
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

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@shop-e.com',
        password: 'admin123',
        warning: 'Please change the password after first login!'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Check database status
// @route   GET /api/setup/status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    res.status(200).json({
      success: true,
      database: {
        users: userCount,
        admins: adminCount,
        categories: categoryCount,
        products: productCount,
        initialized: adminCount > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete all products
// @route   DELETE /api/setup/delete-products
// @access  Public (should be protected in production)
router.delete('/delete-products', async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    
    // Reset all category product counts to 0
    await Category.updateMany({}, { productCount: 0 });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete all categories
// @route   DELETE /api/setup/delete-categories
// @access  Public (should be protected in production)
router.delete('/delete-categories', async (req, res) => {
  try {
    const result = await Category.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} categories`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete all data (products, categories, orders)
// @route   DELETE /api/setup/delete-all-data
// @access  Public (should be protected in production)
router.delete('/delete-all-data', async (req, res) => {
  try {
    const [productsResult, categoriesResult] = await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
    ]);

    res.status(200).json({
      success: true,
      message: 'All data deleted successfully',
      deleted: {
        products: productsResult.deletedCount,
        categories: categoriesResult.deletedCount,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

