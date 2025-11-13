/**
 * API Configuration
 * 
 * Configure API settings here
 */

export const API_CONFIG = {
  // Base URL for API
  BASE_URL: process.env.REACT_APP_API_URL || 'https://shop-e-server.vercel.app/api',
  
  // Timeout for requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Enable API integration
  USE_API: process.env.REACT_APP_USE_API === 'true' || true,
  
  // Enable mock data fallback
  USE_MOCK_FALLBACK: false,
};

/**
 * Feature flags
 */
export const FEATURES = {
  // Enable backend integration
  BACKEND_INTEGRATION: API_CONFIG.USE_API,
  
  // Enable localStorage fallback when API fails
  LOCALSTORAGE_FALLBACK: true,
  
  // Enable payment gateway
  PAYMENT_GATEWAY: true,
  
  // Enable real-time updates (WebSocket)
  REALTIME_UPDATES: false,
};

/**
 * Check if backend is available
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/health`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.warn('Backend not available, using localStorage fallback');
    return false;
  }
};

