import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CheckCircle, CreditCard } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { loadOrders, saveOrders } from '../data/orders';

const MotionCard = motion(Card);

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate order processing
      setTimeout(() => {
        // Create order
        const orders = loadOrders();
        const newOrder = {
          id: Math.max(...orders.map(o => o.id), 0) + 1,
          orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: 'pending',
          paymentStatus: 'paid',
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: 'USA',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Save order
        const updatedOrders = [...orders, newOrder];
        saveOrders(updatedOrders);
        
        // Send notification to admin
        addNotification({
          type: 'order',
          title: 'New Order Received!',
          message: `Order ${newOrder.orderNumber} from ${newOrder.customer.name} - $${total.toFixed(2)}`,
          link: '/admin/orders',
        });
        
        // Save order number for tracking
        localStorage.setItem('lastOrderNumber', newOrder.orderNumber);
        
        setSuccessDialogOpen(true);
        clearCart();
      }, 1000);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    navigate('/');
  };

  if (cartItems.length === 0 && !successDialogOpen) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom fontWeight={600} sx={{ mb: 4 }}>
          Checkout
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Checkout Form */}
            <Grid item xs={12} md={8}>
              {/* Contact Information */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ mb: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>

              {/* Shipping Address */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                sx={{ mb: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Shipping Address
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.state}>
                        <InputLabel>State</InputLabel>
                        <Select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          label="State"
                        >
                          {usStates.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        error={!!errors.zipCode}
                        helperText={errors.zipCode}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>

              {/* Payment Information */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CreditCard sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Payment Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        placeholder="123"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  position: { md: 'sticky' },
                  top: { md: 100 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Order Summary
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Cart Items */}
                  <Box sx={{ mb: 2 }}>
                    {cartItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {item.name} × {item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Totals */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${tax.toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total:
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleSuccessClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent sx={{ textAlign: 'center', py: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
            </motion.div>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your purchase. Your order confirmation has been sent to{' '}
              {formData.email}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleSuccessClose}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Continue Shopping
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Checkout;

