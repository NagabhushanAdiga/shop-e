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
import { loadOrders, saveOrders, orderStatuses, paymentStatuses } from '../../data/orders';

const MotionCard = motion(Card);

const Orders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [orders, setOrders] = useState([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination & Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const handleOpenDetailDialog = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );
    
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    setSnackbar({
      open: true,
      message: `Order status updated to ${newStatus}`,
      severity: 'success',
    });
    
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
        {orderStatuses.map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <Grid item xs={6} sm={6} md={2.4} key={status.value}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: `${status.color}.main` }}>
                      {getStatusIcon(status.value)}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {status.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Orders Table/Cards */}
      {!isMobile ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell><Typography fontWeight={600}>Order #</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Customer</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={600}>Items</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={600}>Total</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Payment</Typography></TableCell>
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
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                      />
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
        </Card>
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
                  <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                    <Chip label={`${order.items.length} items`} size="small" />
                    <Chip label={order.paymentStatus} size="small" color="success" />
                  </Box>
                  <Typography variant="h6" color="success.main" fontWeight={700}>
                    ${order.total.toFixed(2)}
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
                  {selectedOrder.shippingAddress.street}
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body2">{selectedOrder.shippingAddress.country}</Typography>
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
                  <Typography variant="body2" fontWeight={600}>${selectedOrder.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2" fontWeight={600}>${selectedOrder.shipping.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2" fontWeight={600}>${selectedOrder.tax.toFixed(2)}</Typography>
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
          <Button onClick={() => setDetailDialogOpen(false)} variant="outlined">Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDetailDialogOpen(false);
              handleOpenStatusDialog(selectedOrder);
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Order: <strong>{selectedOrder?.orderNumber}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Customer: {selectedOrder?.customer.name}
            </Typography>
          </Box>
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
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Change the order status to update the customer
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
