import API from './api';

export const storeSettingService = {
  /**
   * Get store settings
   */
  getSettings: async () => {
    try {
      const response = await API.get('/store-settings');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Update store settings
   */
  updateSettings: async (settingsData) => {
    try {
      const response = await API.put('/store-settings', settingsData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Reset store settings to default
   */
  resetSettings: async () => {
    try {
      const response = await API.post('/store-settings/reset');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

