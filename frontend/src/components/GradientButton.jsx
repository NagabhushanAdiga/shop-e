import React from 'react';
import { Button } from '@mui/material';
import { useThemeSettings } from '../context/ThemeContext';

const GradientButton = ({ children, sx = {}, ...props }) => {
  const { themeSettings } = useThemeSettings();

  return (
    <Button
      {...props}
      sx={{
        background: `linear-gradient(135deg, ${themeSettings.buttonGradientStart} 0%, ${themeSettings.buttonGradientEnd} 100%)`,
        color: themeSettings.buttonTextColor,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default GradientButton;


