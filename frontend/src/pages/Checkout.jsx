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
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { CheckCircle, CreditCard, LocalShipping, Payment } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { orderService } from '../services/orderService';
import PaymentMethods from '../components/PaymentMethods';
import { formatCurrency } from '../utils/currency';

const MotionCard = motion(Card);

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login', { 
        state: { from: '/checkout', message: 'Please login to complete your order' } 
      });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentError, setPaymentError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  const steps = ['Shipping Information', 'Payment Method', 'Order Confirmation'];

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

  const validateShippingInfo = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateShippingInfo()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setPaymentError('');
  };

  const handlePaymentSuccess = (paymentData) => {
    setPaymentInfo(paymentData);
    
    // Create order
    const orders = loadOrders();
    const newOrder = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      userId: user?.id || null,
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
        image: item.image,
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: 'pending',
      paymentMethod: paymentData.method,
      paymentStatus: paymentData.method === 'Cash on Delivery' ? 'pending' : 'paid',
      transactionId: paymentData.transactionId,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: 'India',
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
      message: `Order ${newOrder.orderNumber} from ${newOrder.customer.name} - ${formatCurrency(total)}`,
      link: '/admin/orders',
    });
    
    // Save order number for tracking
    localStorage.setItem('lastOrderNumber', newOrder.orderNumber);
    
    setActiveStep(2);
    setSuccessDialogOpen(true);
    clearCart();
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
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
  const shipping = subtotal > 4000 ? 0 : 99;
  const tax = subtotal * 0.18; // GST 18%
  const total = subtotal + shipping + tax;

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom fontWeight={600} sx={{ mb: 2 }}>
          Checkout
        </Typography>

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={3}>
          {/* Checkout Form */}
          <Grid item xs={12} md={8}>
            {activeStep === 0 && (
              <>
                {/* Contact Information */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  sx={{ mb: 3 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocalShipping color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Contact Information
                      </Typography>
                    </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocalShipping color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Shipping Address
                      </Typography>
                    </Box>
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

                <Alert severity="warning" icon={false} sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                  ⚠️ POLICY NOTICE: NO RETURN | NO REFUND | NO EXCHANGE
                </Alert>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' },
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 1 && (
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Payment color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Payment Method
                    </Typography>
                  </Box>

                  {paymentError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {paymentError}
                    </Alert>
                  )}

                  <PaymentMethods
                    orderDetails={{
                      total: total,
                      orderId: `TEMP-${Date.now()}`,
                      customerName: `${formData.firstName} ${formData.lastName}`,
                      customerEmail: formData.email,
                      phone: formData.phone,
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                    >
                      Back
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            )}

            {/* Step 3: Order Confirmation */}
            {activeStep === 2 && (
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    Order Placed Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Thank you for your purchase. Your order has been confirmed.
                  </Typography>
                  {paymentInfo && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method: <strong>{paymentInfo.method}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transaction ID: <strong>{paymentInfo.transactionId}</strong>
                      </Typography>
                    </Box>
                  )}
                  
                  <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight={600}>
                      📋 Important Policy Notice:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      • NO RETURN • NO REFUND • NO EXCHANGE
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Please inspect your order carefully upon delivery. All sales are final.
                    </Typography>
                  </Alert>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' },
                    }}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </MotionCard>
            )}
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
                          {formatCurrency(item.price * item.quantity)}
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
                        {formatCurrency(subtotal)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(tax)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total:
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {formatCurrency(total)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;

