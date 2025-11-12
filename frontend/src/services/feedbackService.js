import API from './api';

export const feedbackService = {
  /**
   * Get all feedback (Admin only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/feedback', { params });
      return { success: true, feedbacks: response.data.feedbacks };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get single feedback by ID
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/feedback/${id}`);
      return { success: true, feedback: response.data.feedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new feedback
   */
  create: async (feedbackData) => {
    try {
      const response = await API.post('/feedback', feedbackData);
      return { success: true, feedback: response.data.feedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Respond to feedback (Admin only)
   */
  respond: async (id, response) => {
    try {
      const result = await API.put(`/feedback/${id}/respond`, { response });
      return { success: true, feedback: result.data.feedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update feedback status (Admin only)
   */
  updateStatus: async (id, status) => {
    try {
      const response = await API.put(`/feedback/${id}/status`, { status });
      return { success: true, feedback: response.data.feedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete feedback (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/feedback/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

