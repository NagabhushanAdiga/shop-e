import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderTracking from './pages/OrderTracking';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/Categories';
import AdminProducts from './pages/AdminDashboard';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      lighter: '#e3f2fd',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    success: {
      main: '#2e7d32',
      lighter: '#e8f5e9',
    },
    error: {
      main: '#d32f2f',
      lighter: '#ffebee',
    },
    warning: {
      main: '#ed6c02',
      lighter: '#fff3e0',
    },
    info: {
      main: '#0288d1',
      lighter: '#e1f5fe',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
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

function App() {
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
                        <Route path="/track-order" element={<OrderTracking />} />
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
                  <Route path="settings" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
