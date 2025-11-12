import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  Add,
  Description,
  ListAlt,
  TrendingDown,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadProducts } from '../../data/products';
import { loadOrders } from '../../data/orders';
import { loadUsers } from '../../data/users';
import { formatCurrency } from '../../utils/currency';

const MotionCard = motion(Card);

const StatCard = ({ title, value, icon, gradient, trend }) => (
  <MotionCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    sx={{ 
      height: '100%',
      minHeight: 140,
      background: gradient,
      color: 'white',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }} gutterBottom fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: 'white' }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }} fontWeight={600}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            p: 1.5,
            borderRadius: 2,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </MotionCard>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(loadProducts());
    setOrders(loadOrders());
    setUsers(loadUsers());
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 20).length;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  
  // Payment method statistics
  const paymentMethodStats = {};
  orders.forEach(order => {
    const method = order.paymentMethod || 'Unknown';
    if (!paymentMethodStats[method]) {
      paymentMethodStats[method] = { count: 0, amount: 0 };
    }
    paymentMethodStats[method].count += 1;
    paymentMethodStats[method].amount += order.total;
  });
  
  // Recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Low stock products
  const lowStock = products
    .filter(p => p.stock < 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
    
  // Sales by category
  const categoryStats = {};
  products.forEach(p => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { count: 0, value: 0 };
    }
    categoryStats[p.category].count += 1;
    categoryStats[p.category].value += p.price * p.stock;
  });
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's what's happening with your store today.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalValue)}
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg, #52c41a 0%, #1890ff 100%)"
            trend="+12.5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            trend="+3 new"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg, #0288d1 0%, #00acc1 100%)"
            trend="+8.2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Customers"
            value={totalCustomers}
            icon={<People sx={{ fontSize: 32 }} />}
            gradient="linear-gradient(135deg, #faad14 0%, #ffc53d 100%)"
            trend="+5 today"
          />
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate('/admin/orders')}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {order.orderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.customer.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(order.total)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Low Stock Alert */}
        <Grid item xs={12} lg={5}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Warning sx={{ color: 'error.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Low Stock Alert
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {lowStock.length > 0 ? lowStock.map((product) => (
                  <Box key={product.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Chip
                        label={`${product.stock} left`}
                        size="small"
                        color="error"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(product.stock / 20) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 1,
                        bgcolor: 'error.lighter',
                        '& .MuiLinearProgress-bar': { bgcolor: 'error.main' },
                      }}
                    />
                  </Box>
                )) : (
                  <Typography variant="body2" color="text.secondary">
                    All products are well stocked! 🎉
                  </Typography>
                )}
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Category Performance & Payment Methods */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Category Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {Object.entries(categoryStats).map(([category, stats]) => (
                  <Box key={category}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stats.count} products | {formatCurrency(stats.value)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.count / totalProducts) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 1,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Payment Methods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {Object.entries(paymentMethodStats).map(([method, stats]) => (
                  <Box key={method}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {method}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stats.count} orders | {formatCurrency(stats.amount)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.count / totalOrders) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 1,
                        '& .MuiLinearProgress-bar': {
                          background: method === 'UPI' ? 'linear-gradient(135deg, #00C853 0%, #00E676 100%)' :
                                     method === 'PhonePe' ? 'linear-gradient(135deg, #5f259f 0%, #7c4dff 100%)' :
                                     method === 'Google Pay' ? 'linear-gradient(135deg, #4285F4 0%, #64B5F6 100%)' :
                                     method === 'Card' ? 'linear-gradient(135deg, #FF6B00 0%, #FF8A50 100%)' :
                                     'linear-gradient(135deg, #FFA000 0%, #FFB300 100%)',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => navigate('/admin/products')}
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Add sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>Add New Product</Typography>
                </Box>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => navigate('/admin/orders')}
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <ListAlt sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>View Recent Orders</Typography>
                </Box>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => navigate('/admin/reports')}
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Description sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>Generate Report</Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

