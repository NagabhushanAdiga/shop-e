import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
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
  IconButton,
  Chip,
  Avatar,
  Grid,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
  TablePagination,
  InputAdornment,
  Drawer,
  Divider,
} from '@mui/material';
import { Add, Edit, Delete, Block, CheckCircle, Search, Visibility, VisibilityOff, Close, Email, Phone, Person, CalendarToday, ShoppingCart, AttachMoney, AdminPanelSettings } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { userService } from '../../services/userService';
import { formatCurrency } from '../../utils/currency';

// User roles and statuses constants
const userRoles = ['user', 'admin'];
const userStatuses = ['active', 'inactive', 'suspended'];

const MotionCard = motion(Card);

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  
  // Pagination & Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    avatar: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const result = await userService.getAll();
      if (result.success && result.data) {
        setUsers(result.data.users || result.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load users',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        avatar: user.avatar || '',
        password: '',
        confirmPassword: '',
      });
      setSelectedUser(user);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        avatar: '',
        password: '',
        confirmPassword: '',
      });
      setSelectedUser(null);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      return;
    }

    // Password validation for new users or when password is being changed
    if (!selectedUser || formData.password) {
      if (!formData.password) {
        setSnackbar({
          open: true,
          message: 'Password is required for new users',
          severity: 'error',
        });
        return;
      }

      if (formData.password.length < 6) {
        setSnackbar({
          open: true,
          message: 'Password must be at least 6 characters long',
          severity: 'error',
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'Passwords do not match',
          severity: 'error',
        });
        return;
      }
    }

    let updatedUsers;

    if (selectedUser) {
      // Edit - only update password if it was changed
      const updatedData = { ...formData };
      if (!formData.password) {
        delete updatedData.password;
      }
      delete updatedData.confirmPassword;
      
      updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, ...updatedData }
          : user
      );
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success',
      });
    } else {
      // Add
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        password: formData.password, // In production, this should be hashed
        avatar: formData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        totalOrders: 0,
        totalSpent: 0,
      };
      updatedUsers = [...users, newUser];
      setSnackbar({
        open: true,
        message: `${formData.role === 'admin' ? 'Admin' : 'User'} added successfully!`,
        severity: 'success',
      });
    }

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    handleCloseDialog();
  };

  const handleDelete = () => {
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setSnackbar({
      open: true,
      message: 'User deleted successfully!',
      severity: 'success',
    });
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const handleOpenDetailsDrawer = (user) => {
    setViewingUser(user);
    setDetailsDrawerOpen(true);
  };

  const handleCloseDetailsDrawer = () => {
    setDetailsDrawerOpen(false);
    setTimeout(() => setViewingUser(null), 300);
  };

  // Filter and paginate
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  const paginatedUsers = filteredUsers.slice(
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
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts and permissions
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
          Add User
        </Button>
      </Box>

      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email or phone..."
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
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              height: '100%',
              minHeight: 120,
              background: 'linear-gradient(135deg, #667eea15 0%, #667eea30 100%)',
              borderLeft: '4px solid #667eea',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#667eea' }}>
                {users.length}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              height: '100%',
              minHeight: 120,
              background: 'linear-gradient(135deg, #2e7d3215 0%, #2e7d3230 100%)',
              borderLeft: '4px solid #2e7d32',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Active Users
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {users.filter((u) => u.status === 'active').length}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              height: '100%',
              minHeight: 120,
              background: 'linear-gradient(135deg, #764ba215 0%, #764ba230 100%)',
              borderLeft: '4px solid #764ba2',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Admins
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#764ba2' }}>
                {users.filter((u) => u.role === 'admin').length}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              height: '100%',
              minHeight: 120,
              background: 'linear-gradient(135deg, #52c41a15 0%, #52c41a30 100%)',
              borderLeft: '4px solid #52c41a',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#52c41a' }}>
                {formatCurrency(users.reduce((sum, u) => sum + (u.totalSpent || 0), 0))}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

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
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.avatar}>{user.name.charAt(0)}</Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === 'active' ? 'success' : 'default'}
                        icon={user.status === 'active' ? <CheckCircle /> : <Block />}
                        sx={{
                          '& .MuiChip-icon': {
                            marginLeft: '-2px',
                            marginRight: '6px',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{user.totalOrders}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(user.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(user.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOpenDetailsDrawer(user)}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                        title="Edit User"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user)}
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                        title="Delete User"
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
            count={filteredUsers.length}
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
            {paginatedUsers.map((user) => (
            <Grid item xs={12} key={user.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                sx={{
                  background: 'background.paper',
                  boxShadow: 'none',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={user.avatar} sx={{ width: 60, height: 60 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.phone || 'No phone'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === 'admin' ? 'primary' : 'default'}
                        />
                        <Chip
                          label={user.status}
                          size="small"
                          color={user.status === 'active' ? 'success' : 'default'}
                        />
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Orders: {user.totalOrders} | Spent: {formatCurrency(user.totalSpent)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="info"
                          startIcon={<Visibility />}
                          onClick={() => handleOpenDetailsDrawer(user)}
                          sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenDialog(user)}
                          sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleOpenDeleteDialog(user)}
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
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
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
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
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={selectedUser ? "New Password (leave empty to keep current)" : "Password"}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required={!selectedUser}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={!selectedUser ? "Minimum 6 characters" : "Leave empty to keep current password"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!selectedUser || !!formData.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Re-enter password to confirm"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  {userRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {userStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Avatar URL (optional)"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
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
            {selectedUser ? 'Update' : 'Add'} User
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
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedUser?.name}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Drawer */}
      <Drawer
        anchor="right"
        open={detailsDrawerOpen}
        onClose={handleCloseDetailsDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 450,
            maxWidth: '100%',
          },
        }}
      >
        {viewingUser && (
          <Box>
            {/* Header */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                User Details
              </Typography>
              <IconButton
                onClick={handleCloseDetailsDrawer}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* User Avatar & Name */}
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Avatar
                src={viewingUser.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                {viewingUser.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {viewingUser.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={viewingUser.role}
                  size="medium"
                  color={viewingUser.role === 'admin' ? 'primary' : 'default'}
                  icon={viewingUser.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                  sx={{
                    '& .MuiChip-icon': {
                      marginLeft: '-2px',
                      marginRight: '6px',
                    },
                  }}
                />
                <Chip
                  label={viewingUser.status}
                  size="medium"
                  color={viewingUser.status === 'active' ? 'success' : 'default'}
                  icon={viewingUser.status === 'active' ? <CheckCircle /> : <Block />}
                  sx={{
                    '& .MuiChip-icon': {
                      marginLeft: '-2px',
                      marginRight: '6px',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* User Information */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    <Email />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {viewingUser.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'success.light',
                      color: 'success.main',
                    }}
                  >
                    <Phone />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {viewingUser.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Created At */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'info.light',
                      color: 'info.main',
                    }}
                  >
                    <CalendarToday />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(viewingUser.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Last Login */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'warning.light',
                      color: 'warning.main',
                    }}
                  >
                    <CalendarToday />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(viewingUser.lastLogin)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
                Purchase History
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Total Orders */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'secondary.light',
                      color: 'secondary.main',
                    }}
                  >
                    <ShoppingCart />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="secondary.main">
                      {viewingUser.totalOrders}
                    </Typography>
                  </Box>
                </Box>

                {/* Total Spent */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'success.light',
                      color: 'success.main',
                    }}
                  >
                    <AttachMoney />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="success.main">
                      {formatCurrency(viewingUser.totalSpent)}
                    </Typography>
                  </Box>
                </Box>

                {/* Average Order Value */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    <AttachMoney />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Average Order Value
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {viewingUser.totalOrders > 0 
                        ? formatCurrency(viewingUser.totalSpent / viewingUser.totalOrders)
                        : formatCurrency(0)
                      }
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => {
                    handleCloseDetailsDrawer();
                    handleOpenDialog(viewingUser);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  Edit User
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => {
                    handleCloseDetailsDrawer();
                    handleOpenDeleteDialog(viewingUser);
                  }}
                  disabled={viewingUser.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                  sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

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

export default Users;

