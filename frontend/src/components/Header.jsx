import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Store,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDialog from './CartDialog';

const MotionIconButton = motion(IconButton);

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { getCartCount, setCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Track Order', path: '/track-order' },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'white',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Store sx={{ fontSize: 32, mr: 1 }} />
              </motion.div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Shop-E
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: 'white',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Cart Icon */}
              <MotionIconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                color="inherit"
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={getCartCount()} color="secondary">
                  <ShoppingCart />
                </Badge>
              </MotionIconButton>

              {/* User Icon */}
              <MotionIconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                color="inherit"
                onClick={user ? handleUserMenuOpen : () => navigate('/login')}
              >
                {isAdmin ? <AdminPanelSettings /> : <Person />}
              </MotionIconButton>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                {isAdmin && (
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/admin'); }}>
                    <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              {/* Mobile Menu Icon */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Cart Dialog */}
      <CartDialog />
    </>
  );
};

export default Header;
