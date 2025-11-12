import API from './api';

export const authService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await API.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Logout locally even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update password
   */
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await API.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

