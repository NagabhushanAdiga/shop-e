import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Category as CategoryIcon, Search, CheckCircle, Block, Inventory, Tag } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { categoryService } from '../../services/categoryService';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';

const MotionCard = motion(Card);

const Categories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination & Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    active: true,
  });

  // Update browser tab title dynamically
  useDynamicTitle('Categories');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await categoryService.getAll();
      if (result.success) {
        setCategories(result.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        active: category.active,
      });
      setSelectedCategory(category);
    } else {
      setFormData({
        name: '',
        description: '',
        slug: '',
        image: '',
        active: true,
      });
      setSelectedCategory(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' ? checked : value,
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    try {
      let result;
      
      if (selectedCategory) {
        // Edit existing category
        result = await categoryService.update(selectedCategory.id, formData);
        if (result.success) {
          setSnackbar({
            open: true,
            message: 'Category updated successfully!',
            severity: 'success',
          });
        }
      } else {
        // Add new category
        result = await categoryService.create(formData);
        if (result.success) {
          setSnackbar({
            open: true,
            message: 'Category added successfully!',
            severity: 'success',
          });
        }
      }
      
      if (result.success) {
        await fetchCategories(); // Refresh the list
        handleCloseDialog();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to save category',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save category',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await categoryService.delete(selectedCategory.id);
      
      if (result.success) {
        await fetchCategories(); // Refresh the list
        setSnackbar({
          open: true,
          message: 'Category deleted successfully!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete category',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete category',
        severity: 'error',
      });
    }
    
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Filter and paginate
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your product categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search categories..."
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

      {/* Desktop Table View */}
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
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell align="center">Products</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Avatar
                        src={category.image}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        <CategoryIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={category.slug} 
                        size="small"
                        icon={<Tag />}
                        sx={{
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '4px',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={category.productCount} 
                        size="small" 
                        color="primary"
                        icon={<Inventory />}
                        sx={{
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '4px',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={category.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={category.active ? 'success' : 'default'}
                        icon={category.active ? <CheckCircle /> : <Block />}
                        sx={{
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '4px',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(category)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredCategories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </MotionCard>
      ) : (
        /* Mobile Card View */
        <>
          <Grid container spacing={2}>
            {paginatedCategories.map((category) => (
            <Grid item xs={12} key={category.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                sx={{
                  background: 'background.paper',
                  boxShadow: 'none',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      src={category.image}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    >
                      <CategoryIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {category.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          label={category.slug} 
                          size="small"
                          icon={<Tag />}
                          sx={{
                            '& .MuiChip-icon': {
                              marginLeft: '-2px',
                              marginRight: '4px',
                            },
                          }}
                        />
                        <Chip
                          label={`${category.productCount} products`}
                          size="small"
                          color="primary"
                          icon={<Inventory />}
                          sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              marginLeft: '-2px',
                              marginRight: '4px',
                            },
                          }}
                        />
                        <Chip
                          label={category.active ? 'Active' : 'Inactive'}
                          size="small"
                          color={category.active ? 'success' : 'default'}
                          icon={category.active ? <CheckCircle /> : <Block />}
                          sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              marginLeft: '-2px',
                              marginRight: '4px',
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenDialog(category)}
                          sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleOpenDeleteDialog(category)}
                          sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <TablePagination
              component="div"
              count={filteredCategories.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                helperText="Auto-generated from name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleChange}
                    name="active"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {selectedCategory ? 'Update' : 'Add'} Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCategory?.name}"? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            Delete
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

export default Categories;

