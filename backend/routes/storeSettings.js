const express = require('express');
const router = express.Router();
const {
  getStoreSettings,
  updateStoreSettings,
  resetStoreSettings,
} = require('../controllers/storeSettingController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getStoreSettings)
  .put(protect, authorize('admin'), updateStoreSettings);

router.route('/reset')
  .post(protect, authorize('admin'), resetStoreSettings);

module.exports = router;

