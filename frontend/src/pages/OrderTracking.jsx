import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  LocalShipping,
  Inventory,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loadOrders } from '../data/orders';

const MotionCard = motion(Card);

const OrderTracking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Auto-fill last order number
  React.useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrderNumber');
    if (lastOrder) {
      setOrderNumber(lastOrder);
    }
  }, []);

  const handleTrack = () => {
    setError('');
    setOrder(null);

    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    const orders = loadOrders();
    const foundOrder = orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase()
    );

    if (!foundOrder) {
      setError('Order not found. Please check your order number.');
      return;
    }

    setOrder(foundOrder);
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  const getStepIcon = (step, currentStatus) => {
    const currentStep = getStatusStep(currentStatus);
    
    if (currentStatus === 'cancelled') {
      return <Cancel color="error" />;
    }

    if (step <= currentStep) {
      return <CheckCircle color="success" />;
    }

    switch (step) {
      case 0:
        return <Pending color="disabled" />;
      case 1:
        return <Inventory color="disabled" />;
      case 2:
        return <LocalShipping color="disabled" />;
      case 3:
        return <CheckCircle color="disabled" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={600} gutterBottom>
            Track Your Order
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your order number to check the delivery status
          </Typography>
        </Box>

        {/* Search Box */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ mb: 4 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Order Number"
                placeholder="e.g., ORD-2024-001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                error={!!error && !order}
                helperText={error && !order ? error : 'Enter your order number'}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={handleTrack}
                sx={{
                  minWidth: { xs: '100%', sm: 150 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Track
              </Button>
            </Box>
          </CardContent>
        </MotionCard>

        {/* Order Details */}
        {order && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Order Header */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                        ? 'error'
                        : order.status === 'shipped'
                        ? 'primary'
                        : 'warning'
                    }
                    size="large"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Order Status Stepper */}
              {order.status !== 'cancelled' ? (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Order Status
                  </Typography>
                  <Stepper activeStep={getStatusStep(order.status)} orientation="vertical">
                    <Step>
                      <StepLabel StepIconComponent={() => getStepIcon(0, order.status)}>
                        <Typography fontWeight={600}>Order Placed</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Your order has been received
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel StepIconComponent={() => getStepIcon(1, order.status)}>
                        <Typography fontWeight={600}>Processing</Typography>
                        <Typography variant="caption" color="text.secondary">
                          We're preparing your order
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel StepIconComponent={() => getStepIcon(2, order.status)}>
                        <Typography fontWeight={600}>Shipped</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Your order is on the way
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel StepIconComponent={() => getStepIcon(3, order.status)}>
                        <Typography fontWeight={600}>Delivered</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Order has been delivered
                        </Typography>
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              ) : (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography fontWeight={600}>Order Cancelled</Typography>
                  <Typography variant="body2">
                    This order has been cancelled. If you have any questions, please contact support.
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Order Details */}
              <Grid container spacing={3}>
                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Customer Information
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer.phone}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Shipping Address */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Shipping Address
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2">{order.shippingAddress.street}</Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </Typography>
                    <Typography variant="body2">{order.shippingAddress.country}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Order Items */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Items
              </Typography>
              <List sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                {order.items.map((item, index) => (
                  <ListItem key={index} divider={index < order.items.length - 1}>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{item.name}</Typography>}
                      secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                    />
                    <Typography variant="body1" fontWeight={700} color="primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              {/* Order Summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${order.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${order.shipping.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${order.tax.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Tracking Info */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last Updated: {formatDate(order.updatedAt)}
                </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        )}

        {/* Help Text */}
        {!order && !error && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact us at{' '}
              <Typography component="span" color="primary" fontWeight={600}>
                support@shop-e.com
              </Typography>
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrderTracking;

