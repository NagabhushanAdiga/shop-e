import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  People,
  Inventory,
  LocalShipping,
  Assessment,
  Download,
  CalendarToday,
  BarChart,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/currency';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';

const MotionCard = motion(Card);

const Reports = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  // Update browser tab title dynamically
  useDynamicTitle('Reports & Analytics');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [ordersResult, usersResult, productsResult] = await Promise.all([
          orderService.getAll(),
          userService.getAll(),
          productService.getAll(),
        ]);
        
        if (ordersResult.success && ordersResult.data) {
          setOrders(ordersResult.data.orders || ordersResult.data || []);
        }
        if (usersResult.success && usersResult.data) {
          setUsers(usersResult.data.users || usersResult.data || []);
        }
        if (productsResult.success && productsResult.data) {
          setProducts(productsResult.data.products || productsResult.data || []);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };
    fetchReportData();
  }, []);

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalProducts = products.length;
  
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate monthly growth (mock data)
  const revenueGrowth = 12.5;
  const ordersGrowth = 8.3;
  const usersGrowth = 15.2;

  // Top selling products
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productSales[item.name]) {
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      } else {
        productSales[item.name] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        };
      }
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top customers
  const customerSpending = {};
  orders.forEach(order => {
    if (customerSpending[order.userId]) {
      customerSpending[order.userId].total += order.total;
      customerSpending[order.userId].orders += 1;
    } else {
      const user = users.find(u => u.id === order.userId);
      customerSpending[order.userId] = {
        userId: order.userId,
        name: user?.name || 'Unknown',
        email: user?.email || 'N/A',
        total: order.total,
        orders: 1,
      };
    }
  });

  const topCustomers = Object.values(customerSpending)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const StatCard = ({ title, value, icon, trend, trendValue, gradient }) => (
    <MotionCard
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }} gutterBottom fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="white">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend === 'up' ? (
              <TrendingUp sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}
            >
              {trendValue}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );

  const handleExportExcel = () => {
    const fileName = `Shop-E-Report-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Shop-E Business Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Report Type:', reportType],
      ['Date Range:', dateRange],
      [],
      ['Key Metrics'],
      ['Total Revenue', formatCurrency(totalRevenue)],
      ['Total Orders', totalOrders],
      ['Total Users', totalUsers],
      ['Active Users', activeUsers],
      ['Average Order Value', formatCurrency(averageOrderValue)],
      ['Completed Orders', completedOrders],
      ['Pending Orders', pendingOrders],
      ['Cancelled Orders', cancelledOrders],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Top Products Sheet
    if (topProducts.length > 0) {
      const productsData = [
        ['Rank', 'Product Name', 'Quantity Sold', 'Revenue'],
        ...topProducts.map((product, index) => [
          index + 1,
          product.name,
          product.quantity,
          product.revenue,
        ]),
      ];
      const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(wb, productsSheet, 'Top Products');
    }
    
    // Top Customers Sheet
    if (topCustomers.length > 0) {
      const customersData = [
        ['Rank', 'Customer Name', 'Email', 'Total Orders', 'Total Spent'],
        ...topCustomers.map((customer, index) => [
          index + 1,
          customer.name,
          customer.email,
          customer.orders,
          customer.total,
        ]),
      ];
      const customersSheet = XLSX.utils.aoa_to_sheet(customersData);
      XLSX.utils.book_append_sheet(wb, customersSheet, 'Top Customers');
    }
    
    // Orders Sheet
    if (orders.length > 0) {
      const ordersData = [
        ['Order Number', 'Customer', 'Total', 'Status', 'Payment Method', 'Date'],
        ...orders.map(order => [
          order.orderNumber,
          order.customer.name,
          order.total,
          order.status,
          order.paymentMethod,
          new Date(order.createdAt).toLocaleDateString(),
        ]),
      ];
      const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(wb, ordersSheet, 'All Orders');
    }
    
    // Export
    XLSX.writeFile(wb, fileName);
    setExportMenuAnchor(null);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const fileName = `Shop-E-Report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text('Shop-E Business Report', 14, 20);
    
    // Report Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Report Type: ${reportType}`, 14, 36);
    doc.text(`Date Range: ${dateRange}`, 14, 42);
    
    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Key Metrics Summary', 14, 55);
    
    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', formatCurrency(totalRevenue)],
        ['Total Orders', totalOrders.toString()],
        ['Total Users', totalUsers.toString()],
        ['Active Users', activeUsers.toString()],
        ['Average Order Value', formatCurrency(averageOrderValue)],
        ['Completed Orders', `${completedOrders} (${totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%)`],
        ['Pending Orders', `${pendingOrders} (${totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : 0}%)`],
        ['Cancelled Orders', `${cancelledOrders} (${totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%)`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234] },
    });
    
    // Top Products
    if (topProducts.length > 0) {
      doc.setFontSize(14);
      doc.text('Top Selling Products', 14, doc.lastAutoTable.finalY + 15);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Rank', 'Product Name', 'Quantity', 'Revenue']],
        body: topProducts.map((product, index) => [
          (index + 1).toString(),
          product.name,
          product.quantity.toString(),
          formatCurrency(product.revenue),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] },
      });
    }
    
    // Top Customers
    if (topCustomers.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Top Customers', 14, 20);
      
      doc.autoTable({
        startY: 25,
        head: [['Rank', 'Customer Name', 'Email', 'Orders', 'Total Spent']],
        body: topCustomers.map((customer, index) => [
          (index + 1).toString(),
          customer.name,
          customer.email,
          customer.orders.toString(),
          formatCurrency(customer.total),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] },
      });
    }
    
    // Save PDF
    doc.save(fileName);
    setExportMenuAnchor(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Reports & Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View detailed reports and insights about your business
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Export Report
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            <MenuItem onClick={handleExportExcel}>
              <ListItemIcon>
                <TableChart fontSize="small" sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText>Export as Excel (.xlsx)</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportPDF}>
              <ListItemIcon>
                <PictureAsPdf fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Export as PDF</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="overview">Overview</MenuItem>
              <MenuItem value="sales">Sales Report</MenuItem>
              <MenuItem value="customers">Customer Report</MenuItem>
              <MenuItem value="products">Product Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<AttachMoney sx={{ fontSize: 28 }} />}
            trend="up"
            trendValue={revenueGrowth}
            gradient="linear-gradient(135deg, #52c41a 0%, #1890ff 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart sx={{ fontSize: 28 }} />}
            trend="up"
            trendValue={ordersGrowth}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<People sx={{ fontSize: 28 }} />}
            trend="up"
            trendValue={usersGrowth}
            gradient="linear-gradient(135deg, #0288d1 0%, #00acc1 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(averageOrderValue)}
            icon={<BarChart sx={{ fontSize: 28 }} />}
            gradient="linear-gradient(135deg, #faad14 0%, #ffc53d 100%)"
          />
        </Grid>
      </Grid>

      {/* Order Status Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Status Breakdown
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Delivered</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {completedOrders} ({totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0}
                  sx={{ height: 8, borderRadius: 1, bgcolor: 'success.light', '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Pending/Processing</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {pendingOrders} ({totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : 0}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}
                  sx={{ height: 8, borderRadius: 1, bgcolor: 'warning.light', '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' } }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Cancelled</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {cancelledOrders} ({totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0}
                  sx={{ height: 8, borderRadius: 1, bgcolor: 'error.light', '& .MuiLinearProgress-bar': { bgcolor: 'error.main' } }}
                />
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                User Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'success.light',
                        color: 'success.main',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <People sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>
                      {activeUsers}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'warning.light',
                        color: 'warning.main',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Inventory sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={700}>
                      {totalProducts}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Products
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Top Selling Products */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Selling Products
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                bgcolor: index === 0 ? 'warning.main' : 'grey.300',
                                color: index === 0 ? 'white' : 'text.primary',
                                fontWeight: 600,
                                minWidth: 28,
                              }}
                            />
                            <Typography variant="body2">{product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {product.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            {formatCurrency(product.revenue)}
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

        {/* Top Customers */}
        <Grid item xs={12} lg={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            sx={{
              background: 'background.paper',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Customers
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Total Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.map((customer, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                bgcolor: index === 0 ? 'primary.main' : 'grey.300',
                                color: index === 0 ? 'white' : 'text.primary',
                                fontWeight: 600,
                                minWidth: 28,
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {customer.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {customer.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {customer.orders}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            {formatCurrency(customer.total)}
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
      </Grid>

      {/* Additional Insights */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                >
                  <LocalShipping />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Delivery Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="white">
                    {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Orders successfully delivered
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            sx={{
              background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                >
                  <People />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    User Activity Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="white">
                    {totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Currently active users
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            sx={{
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                >
                  <Assessment />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="white">
                    {totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Users who made purchases
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;

