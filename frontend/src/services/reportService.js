import API from './api';

export const reportService = {
  /**
   * Get dashboard statistics (Admin only)
   */
  getDashboardStats: async () => {
    try {
      const response = await API.get('/reports/dashboard');
      return { success: true, stats: response.data.stats };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get sales report (Admin only)
   */
  getSalesReport: async (params = {}) => {
    try {
      const response = await API.get('/reports/sales', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get customer report (Admin only)
   */
  getCustomerReport: async () => {
    try {
      const response = await API.get('/reports/customers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get product report (Admin only)
   */
  getProductReport: async () => {
    try {
      const response = await API.get('/reports/products');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

