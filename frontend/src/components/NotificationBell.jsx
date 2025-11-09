import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  ShoppingCart,
  CheckCircle,
  Delete,
  DoneAll,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const MotionIconButton = motion(IconButton);

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    handleClose();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleDelete = (notificationId, event) => {
    event.stopPropagation();
    deleteNotification(notificationId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart color="primary" />;
      case 'success':
        return <CheckCircle color="success" />;
      default:
        return <NotificationsActive color="primary" />;
    }
  };

  return (
    <>
      <MotionIconButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        sx={{ color: 'white' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </MotionIconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead} startIcon={<DoneAll />}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((notification, index) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                borderLeft: notification.read ? 'none' : '3px solid',
                borderColor: 'primary.main',
                py: 1.5,
              }}
            >
              <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                      {notification.title}
                    </Typography>
                    {!notification.read && (
                      <Chip label="New" size="small" color="primary" sx={{ height: 18 }} />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
              <IconButton
                size="small"
                onClick={(e) => handleDelete(notification.id, e)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}

        {notifications.length > 10 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" fullWidth>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;

