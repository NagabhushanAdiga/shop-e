import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useThemeSettings = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within a ThemeSettingsProvider');
  }
  return context;
};

const defaultThemeSettings = {
  primaryColor: '#1976d2',
  secondaryColor: '#f50057',
  headerGradientStart: '#667eea',
  headerGradientEnd: '#764ba2',
  buttonGradientStart: '#667eea',
  buttonGradientEnd: '#764ba2',
  buttonTextColor: '#ffffff',
  darkMode: false,
};

export const ThemeSettingsProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState(defaultThemeSettings);

  useEffect(() => {
    // Load theme settings from localStorage
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      setThemeSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateThemeSettings = (newSettings) => {
    const updated = { ...themeSettings, ...newSettings };
    setThemeSettings(updated);
    localStorage.setItem('themeSettings', JSON.stringify(updated));
  };

  const resetThemeSettings = () => {
    setThemeSettings(defaultThemeSettings);
    localStorage.setItem('themeSettings', JSON.stringify(defaultThemeSettings));
  };

  const toggleDarkMode = () => {
    const updated = { ...themeSettings, darkMode: !themeSettings.darkMode };
    setThemeSettings(updated);
    localStorage.setItem('themeSettings', JSON.stringify(updated));
  };

  const value = {
    themeSettings,
    updateThemeSettings,
    resetThemeSettings,
    toggleDarkMode,
    defaultThemeSettings,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


