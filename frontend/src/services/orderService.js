import API from './api';

export const orderService = {
  /**
   * Get all orders (Admin only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/orders', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get single order by ID
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/orders/${id}`);
      return { success: true, order: response.data.order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get current user's orders
   */
  getMyOrders: async () => {
    try {
      const response = await API.get('/orders/myorders');
      return { success: true, orders: response.data.orders };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new order
   */
  create: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return { success: true, order: response.data.order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update order status (Admin only)
   */
  updateStatus: async (id, statusData) => {
    try {
      const response = await API.put(`/orders/${id}`, statusData);
      return { success: true, order: response.data.order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete order (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/orders/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

