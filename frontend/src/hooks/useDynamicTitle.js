import { useEffect } from 'react';
import { useStoreSettings } from '../context/StoreSettingsContext';

/**
 * Custom hook to dynamically update document title and favicon
 * @param {string} pageTitle - Specific page title (e.g., "Products", "Cart")
 */
export const useDynamicTitle = (pageTitle = '') => {
  const { storeSettings } = useStoreSettings();

  useEffect(() => {
    // Update document title
    const storeName = storeSettings?.storeName || 'Shop-E';
    const fullTitle = pageTitle 
      ? `${pageTitle} - ${storeName}`
      : `${storeName} - ${storeSettings?.storeTagline || 'Your Online Store'}`;
    
    document.title = fullTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && storeSettings?.aboutUs) {
      metaDescription.setAttribute('content', storeSettings.aboutUs);
    }

    // Update favicon if provided
    if (storeSettings?.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeSettings.favicon;
    }
  }, [storeSettings, pageTitle]);
};

export default useDynamicTitle;

