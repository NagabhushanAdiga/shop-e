import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Palette, Refresh, Save, DeleteForever, Warning, Storage } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeSettings } from '../../context/ThemeContext';
import API from '../../services/api';
import { storeSettingService } from '../../services/storeSettingService';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';

const MotionCard = motion(Card);

const Settings = () => {
  const { themeSettings, updateThemeSettings, resetThemeSettings, defaultThemeSettings } = useThemeSettings();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', title: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const [colors, setColors] = useState(themeSettings);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Shop-E',
    storeTagline: 'Your Trusted Shopping Partner',
    logo: '',
    favicon: '',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    loaderColor: '#667eea',
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

  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  // Update browser tab title dynamically
  useDynamicTitle('Settings');

  useEffect(() => {
    // Fetch store settings
    const fetchStoreSettings = async () => {
      const result = await storeSettingService.getSettings();
      if (result.success && result.data) {
        setStoreSettings(result.data);
        setLogoPreview(result.data.logo);
        setFaviconPreview(result.data.favicon);
      }
    };
    fetchStoreSettings();
  }, []);

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (field === 'logo') {
          setLogoPreview(base64String);
          handleStoreSettingChange('logo', base64String);
        } else if (field === 'favicon') {
          setFaviconPreview(base64String);
          handleStoreSettingChange('favicon', base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoreSettingChange = (field, value) => {
    if (field.includes('.')) {
      // Handle nested fields like socialMedia.facebook
      const [parent, child] = field.split('.');
      setStoreSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setStoreSettings(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSaveStoreSettings = async () => {
    setLoading(true);
    try {
      const result = await storeSettingService.updateSettings(storeSettings);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Store settings saved successfully! Refresh to see changes.',
          severity: 'success',
        });
        // Update localStorage for immediate effect
        localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      } else {
        throw new Error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenDeleteDialog = (type) => {
    const dialogConfig = {
      products: {
        title: 'Delete All Products?',
        message: 'This will permanently delete ALL products from the database. This action cannot be undone. Are you absolutely sure?',
      },
      categories: {
        title: 'Delete All Categories?',
        message: 'This will permanently delete ALL categories from the database. This action cannot be undone. Are you absolutely sure?',
      },
      all: {
        title: 'Delete All Data?',
        message: 'This will permanently delete ALL products AND categories from the database. This is a destructive action that cannot be undone. Are you absolutely sure?',
      },
    };
    setDeleteDialog({ open: true, type, ...dialogConfig[type] });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, type: '', title: '', message: '' });
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (deleteDialog.type) {
        case 'products':
          endpoint = '/setup/delete-products';
          break;
        case 'categories':
          endpoint = '/setup/delete-categories';
          break;
        case 'all':
          endpoint = '/setup/delete-all-data';
          break;
        default:
          return;
      }

      const response = await API.delete(endpoint);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success',
        });
      } else {
        throw new Error(response.data.message || 'Delete operation failed');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
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
          Store Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your store's branding, appearance, and configuration
        </Typography>
      </Box>

      {/* Store Branding Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba230 100%)',
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Storage color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Store Branding & Information
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                These settings control how your store appears to customers. Changes will be visible across the entire platform.
              </Alert>

              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={storeSettings.storeName}
                    onChange={(e) => handleStoreSettingChange('storeName', e.target.value)}
                    helperText="This appears in the header, title, and all branding"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Store Tagline"
                    value={storeSettings.storeTagline}
                    onChange={(e) => handleStoreSettingChange('storeTagline', e.target.value)}
                    helperText="Short description shown in hero section"
                  />
                </Grid>

                {/* Logo & Favicon */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Store Logo
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Upload logo or paste image URL (recommended: 200x60px)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="Logo URL"
                          value={storeSettings.logo && !storeSettings.logo.startsWith('data:') ? storeSettings.logo : ''}
                          onChange={(e) => handleStoreSettingChange('logo', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<Storage />}
                          fullWidth
                          size="small"
                        >
                          Upload from Device
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                          />
                        </Button>
                      </Box>
                      {logoPreview && (
                        <Box
                          component="img"
                          src={logoPreview}
                          alt="Logo Preview"
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'contain',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                            bgcolor: 'background.paper',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Favicon
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Upload favicon or paste image URL (recommended: 32x32px, square)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="Favicon URL"
                          value={storeSettings.favicon && !storeSettings.favicon.startsWith('data:') ? storeSettings.favicon : ''}
                          onChange={(e) => handleStoreSettingChange('favicon', e.target.value)}
                          placeholder="https://example.com/favicon.ico"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<Storage />}
                          fullWidth
                          size="small"
                        >
                          Upload from Device
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileUpload('favicon', e.target.files[0])}
                          />
                        </Button>
                      </Box>
                      {faviconPreview && (
                        <Box
                          component="img"
                          src={faviconPreview}
                          alt="Favicon Preview"
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'contain',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                            bgcolor: 'background.paper',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Brand Colors */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Brand Colors
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Primary Color
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Main brand color for buttons and accents
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        type="color"
                        value={storeSettings.primaryColor}
                        onChange={(e) => handleStoreSettingChange('primaryColor', e.target.value)}
                        InputProps={{ sx: { height: 56 } }}
                      />
                      <TextField
                        value={storeSettings.primaryColor}
                        onChange={(e) => handleStoreSettingChange('primaryColor', e.target.value)}
                        placeholder="#667eea"
                        sx={{ width: 120 }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Secondary Color
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Accent color for highlights
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        type="color"
                        value={storeSettings.secondaryColor}
                        onChange={(e) => handleStoreSettingChange('secondaryColor', e.target.value)}
                        InputProps={{ sx: { height: 56 } }}
                      />
                      <TextField
                        value={storeSettings.secondaryColor}
                        onChange={(e) => handleStoreSettingChange('secondaryColor', e.target.value)}
                        placeholder="#764ba2"
                        sx={{ width: 120 }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Loader Color
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Loading spinner color across the app
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        type="color"
                        value={storeSettings.loaderColor}
                        onChange={(e) => handleStoreSettingChange('loaderColor', e.target.value)}
                        InputProps={{ sx: { height: 56 } }}
                      />
                      <TextField
                        value={storeSettings.loaderColor}
                        onChange={(e) => handleStoreSettingChange('loaderColor', e.target.value)}
                        placeholder="#667eea"
                        sx={{ width: 120 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={storeSettings.contactEmail}
                    onChange={(e) => handleStoreSettingChange('contactEmail', e.target.value)}
                    helperText="Customer support email"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={storeSettings.contactPhone}
                    onChange={(e) => handleStoreSettingChange('contactPhone', e.target.value)}
                    helperText="Customer support phone number"
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Store Address"
                    multiline
                    rows={2}
                    value={storeSettings.address}
                    onChange={(e) => handleStoreSettingChange('address', e.target.value)}
                    helperText="Physical store address shown in footer"
                  />
                </Grid>

                {/* Business Settings */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Free Shipping Threshold (₹)"
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => handleStoreSettingChange('freeShippingThreshold', Number(e.target.value))}
                    helperText="Orders above this amount get free shipping"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) => handleStoreSettingChange('taxRate', Number(e.target.value))}
                    helperText="GST or tax percentage applied to orders"
                  />
                </Grid>

                {/* Social Media */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Social Media Links
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Facebook URL"
                    value={storeSettings.socialMedia?.facebook || ''}
                    onChange={(e) => handleStoreSettingChange('socialMedia.facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Instagram URL"
                    value={storeSettings.socialMedia?.instagram || ''}
                    onChange={(e) => handleStoreSettingChange('socialMedia.instagram', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Twitter URL"
                    value={storeSettings.socialMedia?.twitter || ''}
                    onChange={(e) => handleStoreSettingChange('socialMedia.twitter', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    value={storeSettings.socialMedia?.linkedin || ''}
                    onChange={(e) => handleStoreSettingChange('socialMedia.linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourpage"
                  />
                </Grid>

                {/* Footer & Policies */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Footer & Policies
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Footer Text"
                    value={storeSettings.footerText}
                    onChange={(e) => handleStoreSettingChange('footerText', e.target.value)}
                    helperText="Main text shown in footer"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About Us"
                    multiline
                    rows={3}
                    value={storeSettings.aboutUs}
                    onChange={(e) => handleStoreSettingChange('aboutUs', e.target.value)}
                    helperText="Brief description about your store"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Return Policy"
                    multiline
                    rows={2}
                    value={storeSettings.returnPolicy}
                    onChange={(e) => handleStoreSettingChange('returnPolicy', e.target.value)}
                    helperText="Your return/refund policy"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveStoreSettings}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  {loading ? 'Saving...' : 'Save Store Settings'}
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Theme Customization Section */}
      <Grid container spacing={3}>
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

      {/* Database Management Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
              border: '2px solid',
              borderColor: 'error.main',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Storage color="error" />
                <Typography variant="h5" fontWeight={600} color="error">
                  Database Management
                </Typography>
              </Box>

              <Alert severity="error" icon={<Warning />} sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600}>
                  ⚠️ Danger Zone - Destructive Actions
                </Typography>
                <Typography variant="caption">
                  These actions will permanently delete data from your database and cannot be undone!
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                {/* Delete All Products */}
                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'error.light',
                      background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.1) 100%)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <DeleteForever sx={{ color: 'error.main' }} />
                        <Typography variant="h6" fontWeight={600}>
                          Delete Products
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Remove all products from the database. Categories will remain intact.
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteForever />}
                        onClick={() => handleOpenDeleteDialog('products')}
                        sx={{ 
                          borderWidth: 2,
                          '&:hover': { borderWidth: 2 },
                        }}
                      >
                        Delete All Products
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Delete All Categories */}
                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'error.light',
                      background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.1) 100%)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <DeleteForever sx={{ color: 'error.main' }} />
                        <Typography variant="h6" fontWeight={600}>
                          Delete Categories
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Remove all categories from the database. Products will remain but won't have categories.
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteForever />}
                        onClick={() => handleOpenDeleteDialog('categories')}
                        sx={{ 
                          borderWidth: 2,
                          '&:hover': { borderWidth: 2 },
                        }}
                      >
                        Delete All Categories
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Delete All Data */}
                <Grid item xs={12} md={4}>
                  <Card 
                    sx={{ 
                      border: '2px solid', 
                      borderColor: 'error.main',
                      background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.2) 100%)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Warning sx={{ color: 'error.main' }} />
                        <Typography variant="h6" fontWeight={600} color="error">
                          Delete All Data
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>EXTREME CAUTION:</strong> Delete ALL products AND categories. Complete data wipe.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForever />}
                        onClick={() => handleOpenDeleteDialog('all')}
                        sx={{ 
                          fontWeight: 700,
                        }}
                      >
                        Delete Everything
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> User accounts and orders are not affected by these operations. Only products and categories will be deleted.
                </Typography>
              </Alert>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          {deleteDialog.title}
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              ⚠️ WARNING: This action is PERMANENT and IRREVERSIBLE!
            </Typography>
          </Alert>
          <DialogContentText>
            {deleteDialog.message}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 600 }}>
            Type "DELETE" below to confirm:
          </DialogContentText>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            sx={{ mt: 2 }}
            onChange={(e) => setDeleteDialog({...deleteDialog, confirmText: e.target.value})}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            disabled={loading}
            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading || deleteDialog.confirmText !== 'DELETE'}
            sx={{ fontWeight: 600 }}
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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


