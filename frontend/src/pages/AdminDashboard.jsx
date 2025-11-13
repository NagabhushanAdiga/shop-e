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
  Button as MuiButton,
  Box as MuiBox,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Inventory,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  CloudUpload,
  Image as ImageIcon,
  Search,
  FilterList,
  CheckCircle,
  Warning,
  Star,
} from '@mui/icons-material';
import { formatCurrency } from '../utils/currency';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Accessories'];
  const allCategories = ['All', ...categories];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const productCategory = typeof product.category === 'object' ? product.category.name : product.category;
    const matchesCategory = categoryFilter === 'All' || productCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
    setImagePreview(null);
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category: typeof product.category === 'object' ? product.category.name : product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
      stock: product.stock,
      featured: product.featured,
    });
    setSelectedProduct(product);
    setImagePreview(product.image);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
    setImagePreview(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size should be less than 5MB',
          severity: 'error',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select a valid image file',
          severity: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setFormData((prev) => ({
          ...prev,
          image: imageData,
        }));
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
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
  
  // Filtered stats
  const filteredCount = filteredProducts.length;
  const filteredValue = filteredProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={600}>
            Product Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetProducts}
              sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
            >
              Reset Products
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category Filter</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category Filter"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                {allCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              title: 'Total Products',
              value: totalProducts,
              icon: <Inventory sx={{ fontSize: 40 }} />,
              color: '#667eea',
            },
            {
              title: 'Total Inventory Value',
              value: formatCurrency(totalValue),
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
              value: formatCurrency(avgPrice),
              icon: <TrendingUp sx={{ fontSize: 40 }} />,
              color: '#faad14',
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                sx={{
                  height: '100%',
                  minHeight: 140,
                  background: index === 0 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : index === 1
                    ? 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)'
                    : index === 2
                    ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)'
                    : 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                  boxShadow: 'none',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }} gutterBottom fontWeight={500}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Products Table */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            background: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Product Management
              </Typography>
              {searchQuery || categoryFilter !== 'All' ? (
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredCount} of {totalProducts} products
                </Typography>
              ) : null}
            </Box>

            {isMobile ? (
              // Mobile Card View
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {filteredProducts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No products found
                    </Typography>
                  </Box>
                ) : filteredProducts.map((product) => (
                  <MotionCard
                    key={product.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    sx={{
                      background: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 'none',
                    }}
                  >
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
                          <Chip label={typeof product.category === 'object' ? product.category.name : product.category} size="small" sx={{ mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Price: {formatCurrency(product.price)}
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
                              sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleOpenDeleteDialog(product)}
                              sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                ))}
              </Box>
            ) : (
              // Desktop Table View
              <TableContainer component={Paper} sx={{ mt: 2, bgcolor: 'background.paper' }}>
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
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            No products found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.map((product) => (
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
                          <Chip label={typeof product.category === 'object' ? product.category.name : product.category} size="small" />
                        </TableCell>
                        <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={product.stock}
                            size="small"
                            color={product.stock < 20 ? 'warning' : 'success'}
                            icon={product.stock < 20 ? <Warning /> : <CheckCircle />}
                            sx={{
                              fontWeight: 600,
                              '& .MuiChip-icon': {
                                marginLeft: '-2px',
                                marginRight: '4px',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">{product.rating}</TableCell>
                        <TableCell>
                          {product.featured && (
                            <Chip 
                              label="Featured" 
                              size="small" 
                              color="primary"
                              icon={<Star />}
                              sx={{
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                  marginLeft: '-2px',
                                  marginRight: '4px',
                                },
                              }}
                            />
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
        </MotionCard>

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
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Product Image
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    {/* Image Preview */}
                    {imagePreview && (
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    )}
                    
                    {/* Upload Button */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{ mb: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                      >
                        Upload Image from Device
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </Button>
                      
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Or enter image URL below
                      </Typography>
                      
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="https://example.com/image.jpg"
                        name="image"
                        value={formData.image}
                        onChange={(e) => {
                          handleFormChange(e);
                          setImagePreview(e.target.value);
                        }}
                      />
                      
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                      </Typography>
                    </Box>
                  </Box>
                </Box>
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
            <Button onClick={handleCloseEditDialog} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
            <Button
              onClick={handleSaveProduct}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
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
            <Button onClick={handleCloseDeleteDialog} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
            <Button onClick={handleDeleteProduct} color="error" variant="contained" sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
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
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
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

export default AdminDashboard;

