import { API_CONFIG, checkBackendHealth } from '../config/apiConfig';

/**
 * Data fetching helper that works with both API and localStorage
 */
class DataManager {
  constructor() {
    this.useAPI = API_CONFIG.USE_API;
    this.backendAvailable = null;
  }

  /**
   * Check if backend is available
   */
  async checkBackend() {
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }
    
    this.backendAvailable = await checkBackendHealth();
    return this.backendAvailable;
  }

  /**
   * Fetch data with fallback
   */
  async fetchWithFallback(apiCall, localStorageKey, fallbackData) {
    // If API is enabled and available, use it
    if (this.useAPI) {
      const isAvailable = await this.checkBackend();
      
      if (isAvailable) {
        try {
          const result = await apiCall();
          if (result.success) {
            // Cache in localStorage
            if (localStorageKey && result.data) {
              localStorage.setItem(localStorageKey, JSON.stringify(result.data));
            }
            return result.data;
          }
        } catch (error) {
          console.warn(`API call failed: ${error.message}`);
        }
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      return JSON.parse(stored);
    }

    // Final fallback to default data
    return fallbackData;
  }

  /**
   * Save data with API and localStorage
   */
  async saveWithFallback(apiCall, localStorageKey, data) {
    // Save to localStorage immediately
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }

    // Try to sync with API if available
    if (this.useAPI) {
      const isAvailable = await this.checkBackend();
      
      if (isAvailable) {
        try {
          const result = await apiCall();
          return result;
        } catch (error) {
          console.warn(`API sync failed: ${error.message}`);
        }
      }
    }

    return { success: true, message: 'Saved locally' };
  }

  /**
   * Enable/disable API mode
   */
  setAPIMode(enabled) {
    this.useAPI = enabled;
    this.backendAvailable = null;
  }
}

export default new DataManager();

