const express = require('express');
const router = express.Router();
const {
  getFeedbacks,
  getFeedback,
  createFeedback,
  respondToFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getFeedbacks)
  .post(protect, createFeedback);

router.route('/:id')
  .get(protect, getFeedback)
  .delete(protect, authorize('admin'), deleteFeedback);

router.put('/:id/respond', protect, authorize('admin'), respondToFeedback);
router.put('/:id/status', protect, authorize('admin'), updateFeedbackStatus);

module.exports = router;

