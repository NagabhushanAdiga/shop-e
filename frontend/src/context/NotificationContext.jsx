import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

