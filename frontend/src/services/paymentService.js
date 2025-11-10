// Payment Gateway Integration Service
// This is a mock implementation. In production, you would integrate with actual payment gateway SDKs

const PAYMENT_GATEWAYS = {
  UPI: 'upi',
  PHONEPE: 'phonepe',
  GOOGLEPAY: 'googlepay',
  CARD: 'card',
  COD: 'cash_on_delivery',
};

// Mock UPI IDs for testing
const MERCHANT_UPI = 'merchant@upi';

class PaymentService {
  /**
   * Initialize UPI payment
   * @param {Object} orderDetails - Order information
   * @returns {Promise<Object>} Payment response
   */
  async initiateUPIPayment(orderDetails) {
    const { amount, orderId, customerName, customerEmail } = orderDetails;

    // In production, integrate with UPI payment gateway
    // For now, return mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          method: 'UPI',
          transactionId: `UPI-${Date.now()}`,
          orderId,
          amount,
          status: 'pending',
          upiLink: `upi://pay?pa=${MERCHANT_UPI}&pn=Shop-E&am=${amount}&tr=${orderId}&tn=Order%20Payment`,
        });
      }, 1000);
    });
  }

  /**
   * Initialize PhonePe payment
   * @param {Object} orderDetails - Order information
   * @returns {Promise<Object>} Payment response
   */
  async initiatePhonePePayment(orderDetails) {
    const { amount, orderId, customerName, customerEmail, phone } = orderDetails;

    // In production, integrate with PhonePe SDK
    // https://developer.phonepe.com/docs
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          method: 'PhonePe',
          transactionId: `PP-${Date.now()}`,
          orderId,
          amount,
          status: 'pending',
          redirectUrl: `https://www.phonepe.com/payment-gateway-mock?amount=${amount}&orderId=${orderId}`,
        });
      }, 1000);
    });
  }

  /**
   * Initialize Google Pay payment
   * @param {Object} orderDetails - Order information
   * @returns {Promise<Object>} Payment response
   */
  async initiateGooglePayPayment(orderDetails) {
    const { amount, orderId, customerName, customerEmail } = orderDetails;

    // In production, integrate with Google Pay API
    // https://developers.google.com/pay/api
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          method: 'Google Pay',
          transactionId: `GP-${Date.now()}`,
          orderId,
          amount,
          status: 'pending',
          paymentData: {
            merchantId: 'YOUR_MERCHANT_ID',
            merchantName: 'Shop-E',
            transactionInfo: {
              totalPrice: amount.toString(),
              currencyCode: 'INR',
            },
          },
        });
      }, 1000);
    });
  }

  /**
   * Process card payment
   * @param {Object} paymentDetails - Card and order details
   * @returns {Promise<Object>} Payment response
   */
  async processCardPayment(paymentDetails) {
    const { cardNumber, cardName, expiryDate, cvv, amount, orderId } = paymentDetails;

    // In production, integrate with payment gateway like Stripe, Razorpay
    // This is a mock implementation for demonstration
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Basic validation
        if (!cardNumber || cardNumber.length < 16) {
          reject({
            success: false,
            message: 'Invalid card number',
          });
          return;
        }

        if (!cvv || cvv.length < 3) {
          reject({
            success: false,
            message: 'Invalid CVV',
          });
          return;
        }

        // Mock success response
        resolve({
          success: true,
          method: 'Card',
          transactionId: `CARD-${Date.now()}`,
          orderId,
          amount,
          status: 'success',
          last4: cardNumber.slice(-4),
        });
      }, 2000);
    });
  }

  /**
   * Verify payment status
   * @param {String} transactionId - Transaction ID to verify
   * @returns {Promise<Object>} Payment status
   */
  async verifyPayment(transactionId) {
    // In production, call payment gateway API to verify
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId,
          status: 'success', // success, pending, failed
          paidAt: new Date().toISOString(),
        });
      }, 1000);
    });
  }

  /**
   * Generate QR code for UPI payment
   * @param {Object} orderDetails - Order information
   * @returns {String} UPI string for QR generation
   */
  generateUPIString(orderDetails) {
    const { amount, orderId } = orderDetails;
    return `upi://pay?pa=${MERCHANT_UPI}&pn=Shop-E&am=${amount}&tr=${orderId}&tn=Payment%20for%20Order%20${orderId}`;
  }

  /**
   * Check if UPI apps are available
   * @returns {Object} Available UPI apps
   */
  checkAvailableUPIApps() {
    // In mobile app, you can check installed apps
    // For web, we'll return all as available
    return {
      phonepe: true,
      googlepay: true,
      paytm: true,
      upi: true,
    };
  }

  /**
   * Initiate refund
   * @param {String} transactionId - Transaction ID
   * @param {Number} amount - Refund amount
   * @returns {Promise<Object>} Refund response
   */
  async initiateRefund(transactionId, amount, reason) {
    // In production, call payment gateway refund API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          refundId: `REF-${Date.now()}`,
          transactionId,
          amount,
          status: 'processing',
          estimatedDays: 5-7,
        });
      }, 1000);
    });
  }
}

export default new PaymentService();
export { PAYMENT_GATEWAYS };

