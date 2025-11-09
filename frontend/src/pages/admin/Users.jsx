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
} from '@mui/material';
import { Add, Edit, Delete, Block, CheckCircle, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loadUsers, saveUsers, userRoles, userStatuses } from '../../data/users';

const MotionCard = motion(Card);

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
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
  });

  useEffect(() => {
    setUsers(loadUsers());
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
      });
      setSelectedUser(null);
    }
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

    let updatedUsers;

    if (selectedUser) {
      // Edit
      updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, ...formData }
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
        ...formData,
        avatar: formData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        totalOrders: 0,
        totalSpent: 0,
      };
      updatedUsers = [...users, newUser];
      setSnackbar({
        open: true,
        message: 'User added successfully!',
        severity: 'success',
      });
    }

    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    handleCloseDialog();
  };

  const handleDelete = () => {
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
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
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {users.filter((u) => u.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Admins
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary">
                {users.filter((u) => u.role === 'admin').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                ${users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Desktop Table View */}
      {!isMobile ? (
        <Card>
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
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{user.totalOrders}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${user.totalSpent.toFixed(2)}
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
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user)}
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
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
        </Card>
      ) : (
        /* Mobile Card View */
        <>
          <Grid container spacing={2}>
            {paginatedUsers.map((user) => (
            <Grid item xs={12} key={user.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
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
                          Orders: {user.totalOrders} | Spent: ${user.totalSpent.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenDialog(user)}
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
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

export default Users;

