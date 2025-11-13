const mongoose = require('mongoose');

const storeSettingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: 'Shop-E',
      trim: true,
    },
    storeTagline: {
      type: String,
      default: 'Your Trusted Shopping Partner',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#667eea',
    },
    secondaryColor: {
      type: String,
      default: '#764ba2',
    },
    loaderColor: {
      type: String,
      default: '#667eea',
    },
    contactEmail: {
      type: String,
      default: 'contact@shop-e.com',
    },
    contactPhone: {
      type: String,
      default: '+1234567890',
    },
    address: {
      type: String,
      default: '123 Shopping Street, City, Country',
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    freeShippingThreshold: {
      type: Number,
      default: 4000,
    },
    taxRate: {
      type: Number,
      default: 18, // GST 18%
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    metaDescription: {
      type: String,
      default: 'Best online shopping platform for all your needs',
    },
    metaKeywords: {
      type: String,
      default: 'ecommerce, online shopping, products',
    },
    footerText: {
      type: String,
      default: 'Your Trusted E-commerce Platform',
    },
    aboutUs: {
      type: String,
      default: 'We are committed to providing the best shopping experience.',
    },
    termsAndConditions: {
      type: String,
      default: 'Terms and conditions content here...',
    },
    privacyPolicy: {
      type: String,
      default: 'Privacy policy content here...',
    },
    returnPolicy: {
      type: String,
      default: 'NO RETURN | NO REFUND | NO EXCHANGE',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StoreSetting', storeSettingSchema);

