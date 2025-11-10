const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesReport,
  getCustomerReport,
  getProductReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/customers', getCustomerReport);
router.get('/products', getProductReport);

module.exports = router;

