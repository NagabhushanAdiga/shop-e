import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const result = await notificationService.getAll();
      if (result.success && result.data) {
        setNotifications(result.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [isAuthenticated, user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated, user]);

  // Load notifications on mount and set up polling
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Initial fetch
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications
    // Admin: every 10 seconds (faster updates for new orders)
    // Regular users: every 30 seconds (for order status updates)
    let pollInterval;
    const pollTime = user?.role === 'admin' ? 10000 : 30000;
    
    pollInterval = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, pollTime);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isAuthenticated, user, fetchNotifications, fetchUnreadCount]);

  const addNotification = (notification) => {
    // For client-side notifications (e.g., success messages)
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        // Remove the notification from the list after marking as read
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId && n.id !== notificationId)
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        // Clear all notifications after marking as read
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const result = await notificationService.delete(notificationId);
      if (result.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId && n.id !== notificationId));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = () => {
    // Clear only local notifications, not server ones
    setNotifications((prev) => prev.filter(n => n._id)); // Keep only server notifications
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchNotifications,
    fetchUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

