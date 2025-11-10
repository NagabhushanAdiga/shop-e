const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalProducts = await Product.countDocuments({ active: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    // Revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 20 }, active: true })
      .select('name stock')
      .sort({ stock: 1 })
      .limit(10);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top selling products
    const topProducts = await Product.find({ active: true })
      .sort({ soldCount: -1 })
      .limit(10);

    // Feedback stats
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    const averageRatingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const averageRating = averageRatingResult.length > 0 ? averageRatingResult[0].avgRating : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        activeUsers,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        lowStockProducts,
        recentOrders,
        topProducts,
        feedback: {
          total: totalFeedback,
          pending: pendingFeedback,
          averageRating: averageRating.toFixed(1),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = { status: { $ne: 'cancelled' } };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.status(200).json({
      success: true,
      salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get customer report
// @route   GET /api/reports/customers
// @access  Private/Admin
exports.getCustomerReport = async (req, res) => {
  try {
    const topCustomers = await User.find({ role: 'user' })
      .select('name email totalOrders totalSpent')
      .sort({ totalSpent: -1 })
      .limit(20);

    const customerStats = {
      totalCustomers: await User.countDocuments({ role: 'user' }),
      activeCustomers: await User.countDocuments({ role: 'user', status: 'active' }),
      newCustomersThisMonth: await User.countDocuments({
        role: 'user',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    };

    res.status(200).json({
      success: true,
      topCustomers,
      stats: customerStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get product report
// @route   GET /api/reports/products
// @access  Private/Admin
exports.getProductReport = async (req, res) => {
  try {
    const topSellingProducts = await Product.find({ active: true })
      .populate('category', 'name')
      .sort({ soldCount: -1 })
      .limit(20);

    const lowStockProducts = await Product.find({ stock: { $lt: 20 }, active: true })
      .populate('category', 'name')
      .sort({ stock: 1 });

    const productsByCategory = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
    ]);

    res.status(200).json({
      success: true,
      topSellingProducts,
      lowStockProducts,
      productsByCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

