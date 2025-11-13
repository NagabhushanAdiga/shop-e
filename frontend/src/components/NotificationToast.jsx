import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton, Box, Typography } from '@mui/material';
import { Close, ShoppingCart } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationToast = () => {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Only show if it's a new notification
      if (latestNotification._id && latestNotification._id !== lastNotificationId && !latestNotification.read) {
        setCurrentNotification(latestNotification);
        setLastNotificationId(latestNotification._id);
        setOpen(true);
      }
    }
  }, [notifications, lastNotificationId]);

  const handleClose = async (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    // Mark as read when dismissed
    if (currentNotification?._id) {
      await markAsRead(currentNotification._id);
    }
    
    setOpen(false);
  };

  const handleClick = async () => {
    // Mark as read when clicked
    if (currentNotification?._id) {
      await markAsRead(currentNotification._id);
    }
    
    if (currentNotification?.link) {
      navigate(currentNotification.link);
    }
    setOpen(false);
  };

  if (!currentNotification) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity="info"
        icon={<ShoppingCart />}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          minWidth: 300,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {currentNotification.title}
          </Typography>
          <Typography variant="body2">
            {currentNotification.message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

