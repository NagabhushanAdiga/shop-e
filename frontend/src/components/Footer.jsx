import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeSettings } from '../context/ThemeContext';

const MotionIconButton = motion(IconButton);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeSettings } = useThemeSettings();

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${themeSettings.headerGradientStart} 0%, ${themeSettings.headerGradientEnd} 100%)`,
        color: 'white',
        mt: 'auto',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              About Shop-E
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
              Your trusted online shopping destination for quality products at
              great prices. Shop with confidence and convenience.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Home', 'Products', 'About Us', 'Contact', 'FAQs'].map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{
                    opacity: 0.9,
                    '&:hover': { opacity: 1 },
                    transition: 'opacity 0.2s',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Shipping Info',
                'Returns',
                'Order Tracking',
                'Privacy Policy',
                'Terms & Conditions',
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{
                    opacity: 0.9,
                    '&:hover': { opacity: 1 },
                    transition: 'opacity 0.2s',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support@shop-e.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Shopping St, NY 10001
                </Typography>
              </Box>
            </Box>

            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[
                { icon: <Facebook />, label: 'Facebook' },
                { icon: <Twitter />, label: 'Twitter' },
                { icon: <Instagram />, label: 'Instagram' },
                { icon: <LinkedIn />, label: 'LinkedIn' },
              ].map((social) => (
                <MotionIconButton
                  key={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  size="small"
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  {social.icon}
                </MotionIconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()} Shop-E. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
              Privacy
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
              Terms
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

