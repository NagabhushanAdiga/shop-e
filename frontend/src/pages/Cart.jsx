import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { useDynamicTitle } from '../hooks/useDynamicTitle';

const MotionCard = motion(Card);

const MAX_QUANTITY_PER_PRODUCT = 5;

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Update browser tab title dynamically
  useDynamicTitle('Shopping Cart');

  const handleClearCart = () => {
    clearCart();
    setClearDialogOpen(false);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      // User is not logged in, show login prompt
      setLoginPromptOpen(true);
    } else {
      // User is logged in, proceed to checkout
      navigate('/checkout');
    }
  };

  const handleLoginRedirect = () => {
    // Save the intended destination
    localStorage.setItem('redirectAfterLogin', '/checkout');
    navigate('/login', { 
      state: { from: '/cart', message: 'Please login to complete your order' } 
    });
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center', minHeight: '60vh' }}>
        <ShoppingCart sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some products to get started!
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={600}>
            Shopping Cart
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setClearDialogOpen(true)}
          >
            Clear Cart
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <MotionCard
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: '100%', sm: 180 },
                        height: { xs: 200, sm: 180 },
                        objectFit: 'cover',
                      }}
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {typeof item.category === 'object' ? item.category.name : item.category}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          {formatCurrency(item.price)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= MAX_QUANTITY_PER_PRODUCT}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        {item.quantity >= MAX_QUANTITY_PER_PRODUCT && (
                          <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                            Max limit reached
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" fontWeight={700}>
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: { md: 'sticky' },
                top: { md: 100 },
                p: 3,
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Order Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(getCartTotal())}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {getCartTotal() > 4000 ? 'FREE' : formatCurrency(99)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Tax (GST 18%):</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(getCartTotal() * 0.18)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {formatCurrency(
                      getCartTotal() +
                      (getCartTotal() > 4000 ? 0 : 99) +
                      getCartTotal() * 0.18
                    )}
                  </Typography>
                </Box>
              </Box>

              {getCartTotal() < 4000 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                >
                  Add {formatCurrency(4000 - getCartTotal())} more for FREE shipping!
                </Typography>
              )}

              <Alert severity="warning" icon={false} sx={{ mt: 3, fontWeight: 600, textAlign: 'center' }}>
                ⚠️ NO RETURN | NO REFUND | NO EXCHANGE
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleProceedToCheckout}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/products"
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* Clear Cart Confirmation Dialog */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Clear Cart?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove all items from your cart? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleClearCart} color="error" variant="contained">
              Clear Cart
            </Button>
          </DialogActions>
        </Dialog>

        {/* Login Prompt Dialog */}
        <Dialog
          open={loginPromptOpen}
          onClose={() => setLoginPromptOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Login Required</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              You need to be logged in to place an order
            </Alert>
            <Typography>
              Please login or create an account to proceed with your order. Your cart items will be saved.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoginPromptOpen(false)}>Continue Shopping</Button>
            <Button 
              onClick={handleLoginRedirect} 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Login / Signup
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Cart;

