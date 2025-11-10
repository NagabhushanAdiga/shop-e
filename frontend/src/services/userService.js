import API from './api';

export const userService = {
  /**
   * Get all users (Admin only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get single user by ID (Admin only)
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/users/${id}`);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new user (Admin only)
   */
  create: async (userData) => {
    try {
      const response = await API.post('/users', userData);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update user (Admin only)
   */
  update: async (id, userData) => {
    try {
      const response = await API.put(`/users/${id}`, userData);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

