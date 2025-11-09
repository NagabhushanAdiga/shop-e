import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Fab,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Inventory,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loadProducts, saveProducts, initialProducts } from '../data/products';

const MotionCard = motion(Card);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [products, setProducts] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    rating: 4.0,
    stock: 0,
    featured: false,
  });

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Accessories'];

  const handleOpenAddDialog = () => {
    setFormData({
      id: null,
      name: '',
      price: '',
      category: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      rating: 4.0,
      stock: 0,
      featured: false,
    });
    setSelectedProduct(null);
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
      stock: product.stock,
      featured: product.featured,
    });
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid price',
        severity: 'error',
      });
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid stock quantity',
        severity: 'error',
      });
      return;
    }

    let updatedProducts;

    if (selectedProduct) {
      // Edit existing product
      updatedProducts = products.map((p) =>
        p.id === selectedProduct.id
          ? {
            ...formData,
            id: selectedProduct.id,
            price,
            stock,
          }
          : p
      );
      setSnackbar({
        open: true,
        message: 'Product updated successfully!',
        severity: 'success',
      });
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: Math.max(...products.map((p) => p.id)) + 1,
        price,
        stock,
      };
      updatedProducts = [...products, newProduct];
      setSnackbar({
        open: true,
        message: 'Product added successfully!',
        severity: 'success',
      });
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    handleCloseEditDialog();
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    const updatedProducts = products.filter((p) => p.id !== selectedProduct.id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setSnackbar({
      open: true,
      message: 'Product deleted successfully!',
      severity: 'success',
    });
    handleCloseDeleteDialog();
  };

  const handleResetProducts = () => {
    setProducts(initialProducts);
    saveProducts(initialProducts);
    setSnackbar({
      open: true,
      message: 'Products reset to default!',
      severity: 'info',
    });
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 20).length;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={600}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetProducts}
            >
              Reset Products
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: 'Total Products',
              value: totalProducts,
              icon: <Inventory sx={{ fontSize: 40 }} />,
              color: '#667eea',
            },
            {
              title: 'Total Inventory Value',
              value: `$${totalValue.toFixed(2)}`,
              icon: <AttachMoney sx={{ fontSize: 40 }} />,
              color: '#52c41a',
            },
            {
              title: 'Low Stock Items',
              value: lowStockProducts,
              icon: <ShoppingCart sx={{ fontSize: 40 }} />,
              color: '#ff4d4f',
            },
            {
              title: 'Average Price',
              value: `$${avgPrice.toFixed(2)}`,
              icon: <TrendingUp sx={{ fontSize: 40 }} />,
              color: '#faad14',
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Products Table */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Product Management
            </Typography>

            {isMobile ? (
              // Mobile Card View
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {products.map((product) => (
                  <Card key={product.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                          src={product.image}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {product.name}
                          </Typography>
                          <Chip label={product.category} size="small" sx={{ mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Price: ${product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Stock: {product.stock}
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => handleOpenEditDialog(product)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleOpenDeleteDialog(product)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              // Desktop Table View
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell>Featured</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <TableCell>
                          <Avatar src={product.image} variant="rounded" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={product.category} size="small" />
                        </TableCell>
                        <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={product.stock}
                            size="small"
                            color={product.stock < 20 ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell align="right">{product.rating}</TableCell>
                        <TableCell>
                          {product.featured && (
                            <Chip label="Featured" size="small" color="primary" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEditDialog(product)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(product)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="Category"
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Rating"
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleFormChange}
                  InputProps={{ inputProps: { min: 0, max: 5, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Featured</InputLabel>
                  <Select
                    name="featured"
                    value={formData.featured}
                    onChange={handleFormChange}
                    label="Featured"
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button
              onClick={handleSaveProduct}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {selectedProduct ? 'Update' : 'Add'} Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Product?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedProduct?.name}"? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteProduct} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            onClick={handleOpenAddDialog}
          >
            <Add />
          </Fab>
        )}

        {/* Snackbar for notifications */}
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
      </Container>
    </Box>
  );
};

export default AdminDashboard;

