const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      customer,
      subtotal,
      tax,
      shippingFee,
      total,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    // Verify stock availability and update
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      customer: customer || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      items,
      subtotal,
      tax,
      shippingFee,
      total,
      paymentMethod,
    });

    // Update product stock and sold count
    for (let item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalOrders: 1, totalSpent: total },
    });

    // Create notifications for all admin users
    try {
      const admins = await User.find({ role: 'admin' });
      const notificationPromises = admins.map(admin =>
        createNotification(admin._id, {
          type: 'order',
          title: 'New Order Received!',
          message: `Order ${order.orderNumber} from ${order.customer.name} - ₹${total.toFixed(2)}`,
          link: `/admin/orders`,
          metadata: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customer.name,
            total: total,
          },
        })
      );
      await Promise.all(notificationPromises);
    } catch (notifError) {
      console.error('Error creating notifications:', notifError);
      // Don't fail the order creation if notifications fail
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const { status, paymentStatus, trackingNumber } = req.body;
    const oldStatus = order.status;
    const oldPaymentStatus = order.paymentStatus;

    if (status) {
      order.status = status;
      if (status === 'delivered') {
        order.deliveredAt = Date.now();
      } else if (status === 'cancelled') {
        order.cancelledAt = Date.now();
        
        // Restore product stock
        for (let item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, soldCount: -item.quantity },
          });
        }
        
        // Update user stats
        await User.findByIdAndUpdate(order.user, {
          $inc: { totalOrders: -1, totalSpent: -order.total },
        });
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    // Create notification for user if status changed
    try {
      if (status && status !== oldStatus) {
        const statusMessages = {
          pending: 'Your order has been received and is awaiting confirmation.',
          processing: 'Your order is being prepared for shipment.',
          shipped: `Your order has been shipped! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
          delivered: 'Your order has been delivered. Thank you for shopping with us!',
          cancelled: 'Your order has been cancelled.',
        };

        const statusTitles = {
          pending: 'Order Received',
          processing: 'Order Processing',
          shipped: 'Order Shipped! 📦',
          delivered: 'Order Delivered! ✅',
          cancelled: 'Order Cancelled',
        };

        await createNotification(order.user, {
          type: 'order',
          title: statusTitles[status] || 'Order Status Updated',
          message: `Order ${order.orderNumber}: ${statusMessages[status] || `Status updated to ${status}`}`,
          link: `/profile`,
          metadata: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status: status,
            total: order.total,
          },
        });
      }

      // Create notification if payment status changed
      if (paymentStatus && paymentStatus !== oldPaymentStatus) {
        const paymentMessages = {
          pending: 'Payment is pending for your order.',
          paid: 'Payment received! Thank you.',
          failed: 'Payment failed. Please try again or contact support.',
          refunded: 'Payment has been refunded to your account.',
        };

        await createNotification(order.user, {
          type: 'order',
          title: 'Payment Status Updated',
          message: `Order ${order.orderNumber}: ${paymentMessages[paymentStatus] || `Payment status: ${paymentStatus}`}`,
          link: `/profile`,
          metadata: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentStatus: paymentStatus,
          },
        });
      }
    } catch (notifError) {
      console.error('Error creating user notification:', notifError);
      // Don't fail the order update if notifications fail
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order by user
// @route   PUT /api/orders/:id/cancel
// @access  Private (User can cancel their own order)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this order',
      });
    }

    // Check if order is eligible for cancellation
    // Only pending orders with Cash on Delivery can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled. It has already been processed.',
      });
    }

    if (order.paymentMethod !== 'Cash on Delivery' && !['UPI', 'PhonePe', 'Google Pay'].includes(order.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Only Cash on Delivery orders can be cancelled.',
      });
    }

    // Cancel the order
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity },
      });
    }

    // Update user stats
    await User.findByIdAndUpdate(order.user, {
      $inc: { totalOrders: -1, totalSpent: -order.total },
    });

    // Create notification for admins about cancellation
    try {
      const admins = await User.find({ role: 'admin' });
      const notificationPromises = admins.map(admin =>
        createNotification(admin._id, {
          type: 'order',
          title: 'Order Cancelled by User',
          message: `Order ${order.orderNumber} was cancelled by ${order.customer.name}`,
          link: `/admin/orders`,
          metadata: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customer.name,
          },
        })
      );
      await Promise.all(notificationPromises);
    } catch (notifError) {
      console.error('Error creating admin notification:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Restore product stock if order wasn't cancelled
    if (order.status !== 'cancelled') {
      for (let item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }

      // Update user stats
      await User.findByIdAndUpdate(order.user, {
        $inc: { totalOrders: -1, totalSpent: -order.total },
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

