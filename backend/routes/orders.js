const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, createOrder);

router.get('/myorders', protect, getMyOrders);

router.put('/:id/cancel', protect, cancelOrder);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin'), updateOrderStatus)
  .delete(protect, authorize('admin'), deleteOrder);

module.exports = router;

