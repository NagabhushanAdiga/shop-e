import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeSettingsProvider, useThemeSettings } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/Categories';
import AdminProducts from './pages/AdminDashboard';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminFeedback from './pages/admin/Feedback';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

const AppContent = () => {
  const { themeSettings } = useThemeSettings();

  const theme = createTheme({
    palette: {
      mode: themeSettings.darkMode ? 'dark' : 'light',
      primary: {
        main: themeSettings.primaryColor,
        light: themeSettings.primaryColor + '80',
        dark: themeSettings.primaryColor,
        lighter: themeSettings.primaryColor + '20',
      },
      secondary: {
        main: themeSettings.secondaryColor,
        light: themeSettings.secondaryColor + '80',
        dark: themeSettings.secondaryColor,
      },
      success: {
        main: '#2e7d32',
        lighter: '#e8f5e9',
        light: '#4caf50',
      },
      error: {
        main: '#d32f2f',
        lighter: '#ffebee',
        light: '#f44336',
      },
      warning: {
        main: '#ed6c02',
        lighter: '#fff3e0',
        light: '#ff9800',
      },
      info: {
        main: '#0288d1',
        lighter: '#e1f5fe',
        light: '#03a9f4',
      },
      background: {
        default: themeSettings.darkMode ? '#121212' : '#f5f5f5',
        paper: themeSettings.darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Public Routes with Header/Footer */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Header />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <UserProfile />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                      <Footer />
                    </>
                  }
                />

                {/* Admin Routes with Admin Layout (Sidebar) - NO Header/Footer */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="feedback" element={<AdminFeedback />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ThemeSettingsProvider>
      <AppContent />
    </ThemeSettingsProvider>
  );
}

export default App;
