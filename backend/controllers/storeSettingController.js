const StoreSetting = require('../models/StoreSetting');

// @desc    Get store settings
// @route   GET /api/store-settings
// @access  Public
exports.getStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await StoreSetting.create({
        storeName: 'Shop-E',
        storeTagline: 'Your Trusted Shopping Partner',
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update store settings
// @route   PUT /api/store-settings
// @access  Private/Admin
exports.updateStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();

    if (!settings) {
      // Create new if doesn't exist
      settings = await StoreSetting.create(req.body);
    } else {
      // Update existing
      settings = await StoreSetting.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset store settings to default
// @route   POST /api/store-settings/reset
// @access  Private/Admin
exports.resetStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();

    if (settings) {
      await StoreSetting.findByIdAndDelete(settings._id);
    }

    // Create new default settings
    settings = await StoreSetting.create({
      storeName: 'Shop-E',
      storeTagline: 'Your Trusted Shopping Partner',
    });

    res.status(200).json({
      success: true,
      message: 'Store settings reset to default',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

