import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { Palette, Refresh, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeSettings } from '../../context/ThemeContext';

const MotionCard = motion(Card);

const Settings = () => {
  const { themeSettings, updateThemeSettings, resetThemeSettings, defaultThemeSettings } = useThemeSettings();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [colors, setColors] = useState(themeSettings);

  const handleColorChange = (field, value) => {
    setColors(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateThemeSettings(colors);
    setSnackbar({
      open: true,
      message: 'Theme settings saved successfully! Refresh to see changes.',
      severity: 'success',
    });
  };

  const handleReset = () => {
    setColors(defaultThemeSettings);
    resetThemeSettings();
    setSnackbar({
      open: true,
      message: 'Theme reset to default! Refresh to see changes.',
      severity: 'info',
    });
  };

  const colorFields = [
    {
      label: 'Primary Color',
      field: 'primaryColor',
      description: 'Main brand color used throughout the app',
    },
    {
      label: 'Secondary Color',
      field: 'secondaryColor',
      description: 'Accent color for highlights and badges',
    },
    {
      label: 'Header Gradient Start',
      field: 'headerGradientStart',
      description: 'Starting color of header gradient',
    },
    {
      label: 'Header Gradient End',
      field: 'headerGradientEnd',
      description: 'Ending color of header gradient',
    },
    {
      label: 'Button Gradient Start',
      field: 'buttonGradientStart',
      description: 'Starting color of button gradient',
    },
    {
      label: 'Button Gradient End',
      field: 'buttonGradientEnd',
      description: 'Ending color of button gradient',
    },
    {
      label: 'Button Text Color',
      field: 'buttonTextColor',
      description: 'Text color on gradient buttons',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Theme Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your store's appearance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Theme Customization */}
        <Grid item xs={12} lg={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Palette color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Color Customization
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Changes will be applied after saving and refreshing the page.
              </Alert>

              <Grid container spacing={3}>
                {colorFields.map((field) => (
                  <Grid item xs={12} sm={6} key={field.field}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        {field.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {field.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          fullWidth
                          type="color"
                          value={colors[field.field]}
                          onChange={(e) => handleColorChange(field.field, e.target.value)}
                          InputProps={{
                            sx: { height: 56 },
                          }}
                        />
                        <TextField
                          value={colors[field.field]}
                          onChange={(e) => handleColorChange(field.field, e.target.value)}
                          placeholder="#000000"
                          sx={{ width: 120 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleReset}
                  sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                >
                  Reset to Default
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.buttonGradientStart}, ${colors.buttonGradientEnd})`,
                    color: colors.buttonTextColor,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Preview Panel */}
        <Grid item xs={12} lg={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 100 },
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Live Preview
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Header Preview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Header Gradient
                </Typography>
                <Paper
                  sx={{
                    height: 80,
                    background: `linear-gradient(135deg, ${colors.headerGradientStart}, ${colors.headerGradientEnd})`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Header Preview
                  </Typography>
                </Paper>
              </Box>

              {/* Button Preview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Button Gradient
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    background: `linear-gradient(135deg, ${colors.buttonGradientStart}, ${colors.buttonGradientEnd})`,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                    color: colors.buttonTextColor,
                    py: 1.5,
                  }}
                >
                  Button Preview
                </Button>
              </Box>

              {/* Primary Color Preview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Primary Color
                </Typography>
                <Box
                  sx={{
                    height: 50,
                    bgcolor: colors.primaryColor,
                    borderRadius: 2,
                  }}
                />
              </Box>

              {/* Secondary Color Preview */}
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Secondary Color
                </Typography>
                <Box
                  sx={{
                    height: 50,
                    bgcolor: colors.secondaryColor,
                    borderRadius: 2,
                  }}
                />
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: 300,
            bgcolor: snackbar.severity === 'success' ? '#2e7d32' : 
                     snackbar.severity === 'error' ? '#d32f2f' : 
                     snackbar.severity === 'warning' ? '#ed6c02' : 
                     '#0288d1',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;


