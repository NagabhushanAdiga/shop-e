const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: false,  // Auto-generated in pre-save hook
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['UPI', 'PhonePe', 'Google Pay', 'Card', 'Cash on Delivery', 'credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      default: 'credit_card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'processing'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: '',
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'phonepe', 'googlepay', 'stripe', 'manual'],
      default: 'razorpay',
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  try {
    if (!this.orderNumber) {
      const count = await mongoose.model('Order').countDocuments();
      const timestamp = Date.now();
      this.orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}-${timestamp.toString().slice(-6)}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);

