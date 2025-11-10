const Order = require('../models/Order');
const crypto = require('crypto');

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    // For Razorpay integration:
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency });

    // Mock response for now
    const paymentOrder = {
      id: `order_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
    };

    res.status(200).json({
      success: true,
      order: paymentOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // For Razorpay verification:
    // const sign = razorpay_order_id + '|' + razorpay_payment_id;
    // const expectedSign = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(sign.toString())
    //   .digest('hex');
    // const isValid = razorpay_signature === expectedSign;

    // Mock verification for now
    const isValid = true;

    if (isValid) {
      // Update order payment status
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          transactionId: razorpay_payment_id,
        });
      }

      res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
  try {
    const { paymentId, amount, orderId } = req.body;

    // For Razorpay refund:
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const refund = await razorpay.payments.refund(paymentId, { amount });

    // Mock refund for now
    const refund = {
      id: `rfnd_${Date.now()}`,
      payment_id: paymentId,
      amount,
      status: 'processed',
    };

    // Update order status
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'refunded',
      });
    }

    res.status(200).json({
      success: true,
      refund,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:transactionId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // For Razorpay:
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const payment = await razorpay.payments.fetch(transactionId);

    // Mock payment details
    const payment = {
      id: transactionId,
      amount: 100000, // in paise
      currency: 'INR',
      status: 'captured',
      method: 'upi',
      created_at: Date.now(),
    };

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

