import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const MotionCard = motion(Card);

const MAX_QUANTITY_PER_PRODUCT = 5;

const CartDialog = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const handleClose = () => {
    setCartOpen(false);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <Dialog
      open={cartOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Shopping Cart ({cartItems.length})
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                handleClose();
                navigate('/products');
              }}
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence>
              {cartItems.map((item) => (
                <MotionCard
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    boxShadow: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', sm: 120 },
                      height: { xs: 150, sm: 120 },
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
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= MAX_QUANTITY_PER_PRODUCT}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      {item.quantity >= MAX_QUANTITY_PER_PRODUCT && (
                        <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.7rem' }}>
                          Max: {MAX_QUANTITY_PER_PRODUCT}
                        </Typography>
                      )}

                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </MotionCard>
              ))}
            </AnimatePresence>
          </Box>
        )}
      </DialogContent>

      {cartItems.length > 0 && (
        <>
          <Divider />
          <DialogActions
            sx={{
              flexDirection: 'column',
              alignItems: 'stretch',
              p: 3,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" color="primary" fontWeight={700}>
                {formatCurrency(getCartTotal())}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Proceed to Checkout
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CartDialog;

