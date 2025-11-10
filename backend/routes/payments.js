const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  processRefund,
  getPaymentDetails,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/refund', protect, authorize('admin'), processRefund);
router.get('/:transactionId', protect, getPaymentDetails);

module.exports = router;

