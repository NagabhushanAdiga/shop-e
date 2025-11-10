/**
 * Razorpay Payment Gateway Integration
 * 
 * This file contains the actual implementation for Razorpay
 * which is the most popular payment gateway in India.
 * 
 * To use this:
 * 1. Sign up at https://razorpay.com/
 * 2. Get your API keys from dashboard
 * 3. Install Razorpay script in public/index.html
 * 4. Replace mock implementation in paymentService.js
 */

class RazorpayService {
  constructor() {
    this.apiKey = process.env.REACT_APP_RAZORPAY_KEY || 'YOUR_RAZORPAY_KEY_ID';
  }

  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Initialize Razorpay payment
   * @param {Object} orderDetails - Order details
   * @param {Function} onSuccess - Success callback
   * @param {Function} onFailure - Failure callback
   */
  async initiatePayment(orderDetails, onSuccess, onFailure) {
    try {
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      
      if (!scriptLoaded) {
        onFailure('Failed to load payment gateway');
        return;
      }

      // Create order on your backend first to get order_id
      // const backendOrder = await createOrderOnBackend(orderDetails);

      const options = {
        key: this.apiKey,
        amount: Math.round(orderDetails.amount * 100), // Amount in paise (₹1 = 100 paise)
        currency: 'INR',
        name: 'Shop-E',
        description: 'Purchase from Shop-E',
        image: '/logo.png', // Your logo URL
        // order_id: backendOrder.razorpay_order_id, // From backend
        handler: function (response) {
          // Payment successful
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'Razorpay',
          });
        },
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.phone,
        },
        notes: {
          orderId: orderDetails.orderId,
        },
        theme: {
          color: '#667eea', // Your brand color
        },
        modal: {
          ondismiss: function () {
            onFailure('Payment cancelled by user');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      onFailure(error.message || 'Payment failed');
    }
  }

  /**
   * Verify payment signature (call this on backend)
   * @param {Object} paymentData - Payment response data
   * @returns {Boolean} Is signature valid
   */
  async verifyPaymentSignature(paymentData) {
    // This should be done on backend for security
    // POST /api/payments/verify with payment data
    // Backend will verify using Razorpay secret
    
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }

  /**
   * Process refund
   * @param {String} paymentId - Razorpay payment ID
   * @param {Number} amount - Refund amount in rupees
   */
  async processRefund(paymentId, amount) {
    // Call your backend API to process refund
    // Backend will use Razorpay API to process refund
    
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          paymentId,
          amount: Math.round(amount * 100), // Convert to paise
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }
}

export default new RazorpayService();

/**
 * BACKEND IMPLEMENTATION EXAMPLE (Node.js/Express)
 * 
 * // Install Razorpay
 * npm install razorpay
 * 
 * // Backend code (controllers/paymentController.js):
 * 
 * const Razorpay = require('razorpay');
 * const crypto = require('crypto');
 * 
 * const razorpay = new Razorpay({
 *   key_id: process.env.RAZORPAY_KEY_ID,
 *   key_secret: process.env.RAZORPAY_KEY_SECRET,
 * });
 * 
 * // Create order
 * exports.createOrder = async (req, res) => {
 *   const { amount, currency = 'INR' } = req.body;
 *   
 *   const options = {
 *     amount: amount * 100, // amount in paise
 *     currency,
 *     receipt: `order_${Date.now()}`,
 *   };
 *   
 *   try {
 *     const order = await razorpay.orders.create(options);
 *     res.json({
 *       success: true,
 *       order,
 *     });
 *   } catch (error) {
 *     res.status(500).json({
 *       success: false,
 *       message: error.message,
 *     });
 *   }
 * };
 * 
 * // Verify payment signature
 * exports.verifyPayment = async (req, res) => {
 *   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
 *   
 *   const sign = razorpay_order_id + '|' + razorpay_payment_id;
 *   const expectedSign = crypto
 *     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
 *     .update(sign.toString())
 *     .digest('hex');
 *   
 *   if (razorpay_signature === expectedSign) {
 *     // Payment is verified, update order status
 *     res.json({
 *       success: true,
 *       verified: true,
 *     });
 *   } else {
 *     res.status(400).json({
 *       success: false,
 *       verified: false,
 *       message: 'Invalid signature',
 *     });
 *   }
 * };
 * 
 * // Process refund
 * exports.refund = async (req, res) => {
 *   const { paymentId, amount } = req.body;
 *   
 *   try {
 *     const refund = await razorpay.payments.refund(paymentId, {
 *       amount: amount, // amount in paise
 *     });
 *     
 *     res.json({
 *       success: true,
 *       refund,
 *     });
 *   } catch (error) {
 *     res.status(500).json({
 *       success: false,
 *       message: error.message,
 *     });
 *   }
 * };
 */

/**
 * HOW TO INTEGRATE WITH YOUR CHECKOUT:
 * 
 * // In Checkout.jsx or PaymentMethods.jsx:
 * import razorpayService from '../services/razorpayIntegration';
 * 
 * const handleRazorpayPayment = async () => {
 *   await razorpayService.initiatePayment(
 *     {
 *       amount: total,
 *       orderId: orderNumber,
 *       customerName: `${firstName} ${lastName}`,
 *       customerEmail: email,
 *       phone: phone,
 *     },
 *     (paymentData) => {
 *       // Success - save order with payment details
 *       saveOrderWithPayment(paymentData);
 *     },
 *     (error) => {
 *       // Failure - show error message
 *       setPaymentError(error);
 *     }
 *   );
 * };
 */

