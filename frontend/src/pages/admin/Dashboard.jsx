import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loadProducts } from '../../data/products';

const MotionCard = motion(Card);

const StatCard = ({ title, value, icon, color, trend }) => (
  <MotionCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
    sx={{ height: '100%' }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" fontWeight={600}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
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

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 20).length;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
  const totalOrders = 156; // Mock data
  const totalCustomers = 89; // Mock data

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
            value={`$${totalValue.toFixed(0)}`}
            icon={<AttachMoney sx={{ fontSize: 32 }} />}
            color="success"
            trend="+12.5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory sx={{ fontSize: 32 }} />}
            color="primary"
            trend="+3 new"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart sx={{ fontSize: 32 }} />}
            color="info"
            trend="+8.2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Customers"
            value={totalCustomers}
            icon={<People sx={{ fontSize: 32 }} />}
            color="warning"
            trend="+5 today"
          />
        </Grid>
      </Grid>

      {/* Additional Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Product Price
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    ${avgPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color={lowStockProducts > 0 ? 'error' : 'success'}>
                    {lowStockProducts}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Featured Products
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {products.filter(p => p.featured).length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Stock Units
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Typography variant="body2">Add New Product</Typography>
                </Paper>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Typography variant="body2">View Recent Orders</Typography>
                </Paper>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Typography variant="body2">Generate Report</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

