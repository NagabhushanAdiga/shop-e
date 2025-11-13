import API from './api';

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/notifications', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    try {
      const response = await API.get('/notifications/unread-count');
      return { success: true, count: response.data.count };
    } catch (error) {
      return { success: false, message: error.message, count: 0 };
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id) => {
    try {
      const response = await API.put(`/notifications/${id}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await API.put('/notifications/mark-all-read');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete notification
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/notifications/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

