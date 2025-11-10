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
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MotionCard = motion(Card);

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setClearDialogOpen(false);
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
                          {item.category}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${item.price.toFixed(2)}
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
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" fontWeight={700}>
                            ${(item.price * item.quantity).toFixed(2)}
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
                    ${getCartTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Shipping:</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {getCartTotal() > 50 ? 'FREE' : '$5.99'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Tax:</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    ${(getCartTotal() * 0.08).toFixed(2)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    ${(
                      getCartTotal() +
                      (getCartTotal() > 50 ? 0 : 5.99) +
                      getCartTotal() * 0.08
                    ).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {getCartTotal() < 50 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                >
                  Add ${(50 - getCartTotal()).toFixed(2)} more for FREE shipping!
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/checkout')}
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
      </Container>
    </Box>
  );
};

export default Cart;

