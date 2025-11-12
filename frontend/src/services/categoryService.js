import API from './api';

export const categoryService = {
  /**
   * Get all categories
   */
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/categories', { params });
      return { success: true, categories: response.data.categories };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get single category by ID
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/categories/${id}`);
      return { success: true, category: response.data.category, products: response.data.products };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Create new category (Admin only)
   */
  create: async (categoryData) => {
    try {
      const response = await API.post('/categories', categoryData);
      return { success: true, category: response.data.category };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update category (Admin only)
   */
  update: async (id, categoryData) => {
    try {
      const response = await API.put(`/categories/${id}`, categoryData);
      return { success: true, category: response.data.category };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Delete category (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/categories/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

