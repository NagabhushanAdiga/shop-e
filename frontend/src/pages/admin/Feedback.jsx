import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Divider,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Visibility,
  Reply,
  CheckCircle,
  Pending,
  Star,
  Search,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { feedbackService } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import { useDynamicTitle } from '../../hooks/useDynamicTitle';

// Feedback statuses constant
const feedbackStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'reviewed', label: 'Reviewed', color: 'info' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' }
];

const MotionCard = motion(Card);

const Feedback = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Update browser tab title dynamically
  useDynamicTitle('User Feedback');

  const fetchFeedback = async () => {
    try {
      const result = await feedbackService.getAll();
      if (result.success) {
        const feedbackData = result.feedbacks || [];
        setFeedbacks(feedbackData);
        setFilteredFeedbacks(feedbackData);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFeedbacks(filtered);
  }, [searchQuery, statusFilter, feedbacks]);

  const handleOpenViewDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedFeedback(null);
  };

  const handleOpenResponseDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || '');
    setResponseDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
    setSelectedFeedback(null);
    setResponseText('');
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a response',
        severity: 'error',
      });
      return;
    }

    const updatedFeedbacks = feedbacks.map(f =>
      f.id === selectedFeedback.id
        ? {
            ...f,
            response: responseText,
            status: 'responded',
            respondedAt: new Date().toISOString(),
            respondedBy: user?.name || 'Admin',
          }
        : f
    );

    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedbacks));

    setSnackbar({
      open: true,
      message: 'Response sent successfully!',
      severity: 'success',
    });

    handleCloseResponseDialog();
  };

  const handleMarkAsResolved = (feedback) => {
    const updatedFeedbacks = feedbacks.map(f =>
      f.id === feedback.id
        ? { ...f, status: 'resolved' }
        : f
    );

    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedbacks));

    setSnackbar({
      open: true,
      message: 'Feedback marked as resolved!',
      severity: 'success',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'responded':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'default',
      product: 'primary',
      shipping: 'secondary',
      support: 'success',
      feature: 'info',
      bug: 'error',
    };
    return colors[category] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate statistics
  const totalFeedback = feedbacks.length;
  const pendingFeedback = feedbacks.filter(f => f.status === 'pending').length;
  const respondedFeedback = feedbacks.filter(f => f.status === 'responded').length;
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          User Feedback
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and respond to customer feedback
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <FeedbackIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Total Feedback
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {totalFeedback}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Pending />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Pending
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {pendingFeedback}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <CheckCircle />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Responded
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {respondedFeedback}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            whileHover={{ y: -8, scale: 1.02 }}
            sx={{
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Star />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Avg Rating
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {averageRating}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by name, subject, or message..."
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
            <Tabs
              value={statusFilter}
              onChange={(e, newValue) => setStatusFilter(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="all" />
              <Tab label="Pending" value="pending" />
              <Tab label="Responded" value="responded" />
              <Tab label="Resolved" value="resolved" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      {/* Feedback Table */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ background: 'background.paper', boxShadow: 'none' }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>User</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={feedback.userAvatar}>{feedback.userName.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {feedback.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feedback.userEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {feedback.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={feedback.category}
                      size="small"
                      color={getCategoryColor(feedback.category)}
                    />
                  </TableCell>
                  <TableCell>
                    <Rating value={feedback.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={feedback.status}
                      size="small"
                      color={getStatusColor(feedback.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(feedback.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleOpenViewDialog(feedback)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenResponseDialog(feedback)}
                      title="Respond"
                    >
                      <Reply />
                    </IconButton>
                    {feedback.status === 'responded' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleMarkAsResolved(feedback)}
                        title="Mark as Resolved"
                      >
                        <CheckCircle />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionCard>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Feedback Details</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar src={selectedFeedback.userAvatar} sx={{ width: 56, height: 56 }}>
                  {selectedFeedback.userName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedFeedback.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedFeedback.userEmail}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {selectedFeedback.subject}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Category & Rating
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <Chip label={selectedFeedback.category} size="small" color={getCategoryColor(selectedFeedback.category)} />
                  <Rating value={selectedFeedback.rating} readOnly size="small" />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Message
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedFeedback.message}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Submitted On
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedFeedback.createdAt)}
                </Typography>
              </Box>

              {selectedFeedback.response && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Admin Response
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {selectedFeedback.response}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Responded by {selectedFeedback.respondedBy} on {formatDate(selectedFeedback.respondedAt)}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} sx={{ boxShadow: 'none' }}>Close</Button>
          {selectedFeedback && !selectedFeedback.response && (
            <Button
              onClick={() => {
                handleCloseViewDialog();
                handleOpenResponseDialog(selectedFeedback);
              }}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              Respond
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Response Dialog */}
      <Dialog
        open={responseDialogOpen}
        onClose={handleCloseResponseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Respond to Feedback</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {selectedFeedback.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFeedback.message}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Your Response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponseDialog} sx={{ boxShadow: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSubmitResponse}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Send Response
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

export default Feedback;

