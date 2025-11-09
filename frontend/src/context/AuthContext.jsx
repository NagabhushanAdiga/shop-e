import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate login - in real app, this would call an API
    // Admin credentials: admin@shop-e.com / admin123
    const isAdmin = email === 'admin@shop-e.com' && password === 'admin123';
    
    const userData = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const signup = (name, email, password) => {
    // Simulate signup - in real app, this would call an API
    const userData = {
      id: Date.now(),
      email,
      name,
      role: 'user', // Default role is user
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
