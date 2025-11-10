import API from './api';

export const productService = {
  /**
   * Get all products with optional filters
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/products', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get single product by ID
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return { success: true, product: response.data.product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new product (Admin only)
   */
  create: async (productData) => {
    try {
      const response = await API.post('/products', productData);
      return { success: true, product: response.data.product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update product (Admin only)
   */
  update: async (id, productData) => {
    try {
      const response = await API.put(`/products/${id}`, productData);
      return { success: true, product: response.data.product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete product (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/products/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Search products
   */
  search: async (searchQuery, filters = {}) => {
    try {
      const response = await API.get('/products', {
        params: { search: searchQuery, ...filters },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Upload product image (Admin only)
   */
  uploadImage: async (id, formData) => {
    try {
      const response = await API.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

