import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Paper,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  LocalShipping,
  Pending,
  Search,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/currency';
import Loader from '../../components/Loader';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';

// Order status constants
const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const paymentStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'default' },
];

const MotionCard = motion(Card);

const Orders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination & Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Update browser tab title dynamically
  useDynamicTitle('Orders');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await orderService.getAll();
      if (result.success && result.data) {
        setOrders(result.data.orders || result.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetailDialog = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus || 'pending');
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      console.log('🔄 Updating order:', { 
        orderId: selectedOrder._id || selectedOrder.id, 
        newStatus,
        newPaymentStatus
      });
      
      const result = await orderService.updateStatus(
        selectedOrder._id || selectedOrder.id, 
        { 
          status: newStatus,
          paymentStatus: newPaymentStatus
        }
      );
      
      console.log('🔄 Update result:', result);
      
      if (result.success) {
        // Refresh orders after update
        await fetchOrders();
        
        setSnackbar({
          open: true,
          message: `Order updated successfully`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update order',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('💥 Update error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update order',
        severity: 'error',
      });
    }
    
    setStatusDialogOpen(false);
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Pending />;
      case 'processing':
        return <Edit />;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Filter and paginate
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Orders Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track customer orders
        </Typography>
      </Box>

      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by order number, customer name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {orderStatuses.map((status, index) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <Grid item xs={6} sm={6} md={2.4} key={status.value}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                sx={{
                  height: '100%',
                  minHeight: 120,
                  background: `linear-gradient(135deg, ${status.color === 'warning' ? '#ed6c0215' : status.color === 'success' ? '#2e7d3215' : status.color === 'error' ? '#d32f2f15' : status.color === 'info' ? '#0288d115' : '#667eea15'} 0%, ${status.color === 'warning' ? '#ed6c0230' : status.color === 'success' ? '#2e7d3230' : status.color === 'error' ? '#d32f2f30' : status.color === 'info' ? '#0288d130' : '#667eea30'} 100%)`,
                  borderLeft: `4px solid`,
                  borderColor: `${status.color}.main`,
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: `${status.color}.main` }}>
                      {getStatusIcon(status.value)}
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {status.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: `${status.color}.main` }}>
                    {count}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Orders Table/Cards */}
      {!isMobile ? (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            background: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell><Typography fontWeight={600}>Order #</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Customer</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={600}>Items</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={600}>Total</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Payment Method</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Payment Status</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Date</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={600}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{order.customer.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`${order.items.length} items`} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                        sx={{
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '6px',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.paymentMethod || 'Card'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        color={
                          paymentStatuses.find((p) => p.value === order.paymentStatus)?.color
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDetailDialog(order)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenStatusDialog(order)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </MotionCard>
      ) : (
        /* Mobile Card View */
        <>
          <Grid container spacing={2}>
            {paginatedOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {order.orderNumber}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status)}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {order.customer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {order.customer.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
                    <Chip label={`${order.items.length} items`} size="small" />
                    <Chip 
                      label={order.paymentMethod || 'Card'} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={order.paymentStatus} 
                      size="small" 
                      color={
                        paymentStatuses.find((p) => p.value === order.paymentStatus)?.color || 'default'
                      }
                    />
                  </Box>
                  <Typography variant="h6" color="success.main" fontWeight={700}>
                    {formatCurrency(order.total)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleOpenDetailDialog(order)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => handleOpenStatusDialog(order)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <TablePagination
              component="div"
              count={filteredOrders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </>
      )}

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
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
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Order Status
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={selectedOrder.status}
                        color={getStatusColor(selectedOrder.status)}
                        icon={getStatusIcon(selectedOrder.status)}
                        sx={{
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '6px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={selectedOrder.paymentStatus}
                        color={
                          paymentStatuses.find((p) => p.value === selectedOrder.paymentStatus)
                            ?.color
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Payment Information */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Payment Information
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedOrder.paymentMethod || 'N/A'}
                  </Typography>
                </Box>
                {selectedOrder.transactionId && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                      {selectedOrder.transactionId}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                  <Chip
                    label={selectedOrder.paymentStatus}
                    size="small"
                    color={
                      paymentStatuses.find((p) => p.value === selectedOrder.paymentStatus)
                        ?.color
                    }
                  />
                </Box>
              </Paper>

              {/* Customer Info */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Customer Information
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                <Typography variant="body2" fontWeight={600}>{selectedOrder.customer.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.customer.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.customer.phone}
                </Typography>
              </Paper>

              {/* Shipping Address */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Shipping Address
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                <Typography variant="body2">
                  {selectedOrder.customer?.address?.street || selectedOrder.shippingAddress?.street}
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.customer?.address?.city || selectedOrder.shippingAddress?.city}, {selectedOrder.customer?.address?.state || selectedOrder.shippingAddress?.state}{' '}
                  {selectedOrder.customer?.address?.zipCode || selectedOrder.shippingAddress?.zipCode}
                </Typography>
                <Typography variant="body2">{selectedOrder.customer?.address?.country || selectedOrder.shippingAddress?.country}</Typography>
              </Paper>

              {/* Order Items */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Order Items
              </Typography>
              <List sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                {selectedOrder.items.map((item, index) => (
                  <ListItem key={index} divider={index < selectedOrder.items.length - 1}>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{item.name}</Typography>}
                      secondary={`Quantity: ${item.quantity} × ${formatCurrency(item.price)}`}
                    />
                    <Typography variant="body1" fontWeight={700} color="primary">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              {/* Order Summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedOrder.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedOrder.shippingFee || selectedOrder.shipping || 0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax (GST 18%):</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedOrder.tax)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(selectedOrder.total)}
                  </Typography>
                </Box>
              </Box>

              {/* Dates */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <strong>Last Updated:</strong> {formatDate(selectedOrder.updatedAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDetailDialogOpen(false)} variant="outlined" sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDetailDialogOpen(false);
              handleOpenStatusDialog(selectedOrder);
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Order Status & Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Order: <strong>{selectedOrder?.orderNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Customer: {selectedOrder?.customer.name}
            </Typography>
          </Box>
          
          {/* Order Status Dropdown */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Order Status"
            >
              {orderStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(status.value)}
                    {status.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Payment Status Dropdown */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              label="Payment Status"
            >
              {paymentStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Update both order status and payment status as needed
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setStatusDialogOpen(false)} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: 300,
            bgcolor: snackbar.severity === 'success' ? '#2e7d32' : 
                     snackbar.severity === 'error' ? '#d32f2f' : 
                     snackbar.severity === 'warning' ? '#ed6c02' : 
                     '#0288d1',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
