import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Edit,
  LocalShipping,
  CheckCircle,
  Pending,
  Visibility,
  Person,
  ShoppingBag,
  Inventory,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadOrders } from '../data/orders';

const MotionCard = motion(Card);

const UserProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's orders
    const allOrders = loadOrders();
    const myOrders = allOrders.filter(order => 
      order.customer.email.toLowerCase() === user?.email.toLowerCase()
    );
    setUserOrders(myOrders);
  }, [isAuthenticated, navigate, user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    // In real app, this would update user profile via API
    setEditDialogOpen(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Pending />;
      case 'processing':
        return <Inventory />;
      case 'shipped':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return null;
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = userOrders.filter(o => o.status === 'delivered').length;

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Profile Header */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ mb: 3 }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    bgcolor: 'primary.main',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={600} gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<ShoppingBag />}
                    label={`${userOrders.length} Orders`}
                    color="primary"
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label={`${completedOrders} Completed`}
                    color="success"
                  />
                  <Chip
                    label={`$${totalSpent.toFixed(2)} Spent`}
                    color="secondary"
                  />
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Person />} label="Profile" iconPosition="start" />
            <Tab icon={<ShoppingBag />} label="My Orders" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Profile Tab */}
        {activeTab === 0 && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Profile Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user?.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Account Type
                  </Typography>
                  <Chip
                    label={user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    color={user?.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(user?.id).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Statistics */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Statistics
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                      <Typography variant="h4" color="primary" fontWeight={700}>
                        {userOrders.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        {completedOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.lighter' }}>
                      <Typography variant="h4" color="secondary" fontWeight={700}>
                        ${totalSpent.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </MotionCard>
        )}

        {/* Orders Tab */}
        {activeTab === 1 && (
          <Box>
            {userOrders.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Orders Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start shopping to see your orders here
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {userOrders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight={600} color="primary">
                              {order.orderNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Placed on {formatDate(order.createdAt)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              icon={getStatusIcon(order.status)}
                            />
                            <IconButton
                              color="primary"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Visibility />
                            </IconButton>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Order Items Summary */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Items ({order.items.length}):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {order.items.map((item, index) => (
                              <Chip
                                key={index}
                                label={`${item.name} x${item.quantity}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Order Status Progress */}
                        {order.status !== 'cancelled' && (
                          <Box sx={{ mb: 2 }}>
                            <Stepper
                              activeStep={getStatusStep(order.status)}
                              alternativeLabel={!isMobile}
                              orientation={isMobile ? 'vertical' : 'horizontal'}
                            >
                              <Step>
                                <StepLabel>Placed</StepLabel>
                              </Step>
                              <Step>
                                <StepLabel>Processing</StepLabel>
                              </Step>
                              <Step>
                                <StepLabel>Shipped</StepLabel>
                              </Step>
                              <Step>
                                <StepLabel>Delivered</StepLabel>
                              </Step>
                            </Stepper>
                          </Box>
                        )}

                        {/* Total */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                            p: 2,
                            bgcolor: 'primary.lighter',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            Total Amount:
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight={700}>
                            ${order.total.toFixed(2)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Edit Profile Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={profileData.city}
                  onChange={(e) =>
                    setProfileData({ ...profileData, city: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={profileData.state}
                  onChange={(e) =>
                    setProfileData({ ...profileData, state: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={profileData.zipCode}
                  onChange={(e) =>
                    setProfileData({ ...profileData, zipCode: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveProfile}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order Detail Dialog */}
        <Dialog
          open={orderDetailDialog}
          onClose={() => setOrderDetailDialog(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Order Details - {selectedOrder?.orderNumber}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box>
                {/* Order Status */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Order Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status.toUpperCase()}
                    color={getStatusColor(selectedOrder.status)}
                    icon={getStatusIcon(selectedOrder.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Status Stepper */}
                {selectedOrder.status !== 'cancelled' && (
                  <Box sx={{ mb: 3 }}>
                    <Stepper activeStep={getStatusStep(selectedOrder.status)} orientation="vertical">
                      <Step>
                        <StepLabel>
                          <Typography fontWeight={600}>Order Placed</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Your order has been received
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography fontWeight={600}>Processing</Typography>
                          <Typography variant="caption" color="text.secondary">
                            We're preparing your order
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography fontWeight={600}>Shipped</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Your order is on the way
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>
                          <Typography fontWeight={600}>Delivered</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Order has been delivered
                          </Typography>
                        </StepLabel>
                      </Step>
                    </Stepper>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Shipping Address */}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Shipping Address
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.country}
                  </Typography>
                </Paper>

                {/* Order Items */}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Order Items
                </Typography>
                <List sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                  {selectedOrder.items.map((item, index) => (
                    <ListItem key={index} divider={index < selectedOrder.items.length - 1}>
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
                      ${selectedOrder.subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${selectedOrder.shipping.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${selectedOrder.tax.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      ${selectedOrder.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Timestamps */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Updated: {formatDate(selectedOrder.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDetailDialog(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserProfile;

