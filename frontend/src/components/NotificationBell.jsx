import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Drawer,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  ShoppingCart,
  CheckCircle,
  Delete,
  DoneAll,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const MotionIconButton = motion(IconButton);

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = () => {
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
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
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </MotionIconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420 },
            maxWidth: '100%',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActive />
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip 
                label={unreadCount} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600,
                }} 
              />
            )}
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Mark all read button */}
        {unreadCount > 0 && (
          <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleMarkAllRead}
              startIcon={<DoneAll />}
              sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
            >
              Mark all as read
            </Button>
          </Box>
        )}

        <Divider />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" variant="h6">
              No notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                disablePadding
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    borderLeft: notification.read ? 'none' : '4px solid',
                    borderColor: 'primary.main',
                    py: 2,
                    '&:hover': {
                      bgcolor: notification.read ? 'action.hover' : 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {getIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={notification.read ? 500 : 700}
                          sx={{ flex: 1 }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip 
                            label="New" 
                            size="small" 
                            color="primary" 
                            sx={{ height: 20, fontSize: '0.7rem' }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
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
                    sx={{ ml: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {notifications.length > 10 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button 
                fullWidth 
                variant="outlined"
                sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
              >
                View All Notifications ({notifications.length})
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default NotificationBell;

