import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeSettingService } from '../services/storeSettingService';

const StoreSettingsContext = createContext();

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};

export const StoreSettingsProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Shop-E',
    storeTagline: 'Your Trusted Shopping Partner',
    logo: '',
    favicon: '',
    contactEmail: 'contact@shop-e.com',
    contactPhone: '+1234567890',
    address: '123 Shopping Street, City, Country',
    freeShippingThreshold: 4000,
    taxRate: 18,
    footerText: 'Your Trusted E-commerce Platform',
    aboutUs: 'We are committed to providing the best shopping experience.',
    returnPolicy: 'NO RETURN | NO REFUND | NO EXCHANGE',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Try to get from API first
        const result = await storeSettingService.getSettings();
        if (result.success && result.data) {
          setStoreSettings(result.data);
          localStorage.setItem('storeSettings', JSON.stringify(result.data));
        } else {
          // Fallback to localStorage
          const cached = localStorage.getItem('storeSettings');
          if (cached) {
            setStoreSettings(JSON.parse(cached));
          }
        }
      } catch (error) {
        console.log('Using default store settings');
        // Use default settings if API fails
        const cached = localStorage.getItem('storeSettings');
        if (cached) {
          setStoreSettings(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    const result = await storeSettingService.getSettings();
    if (result.success && result.data) {
      setStoreSettings(result.data);
      localStorage.setItem('storeSettings', JSON.stringify(result.data));
    }
  };

  const value = {
    storeSettings,
    loading,
    refreshSettings,
  };

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

