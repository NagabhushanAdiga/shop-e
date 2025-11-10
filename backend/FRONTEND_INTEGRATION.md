# Frontend Integration Guide

## Step 1: Install Axios in Frontend

```bash
cd frontend
npm install axios
```

## Step 2: Create API Service

Create `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

## Step 3: Create API Methods

Create `frontend/src/services/authService.js`:

```javascript
import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data.user;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await API.put('/auth/updatepassword', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
```

Create `frontend/src/services/productService.js`:

```javascript
import API from './api';

export const productService = {
  getAll: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data.product;
  },

  create: async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  search: async (searchQuery, filters = {}) => {
    const response = await API.get('/products', {
      params: { search: searchQuery, ...filters },
    });
    return response.data;
  },
};
```

Create `frontend/src/services/orderService.js`:

```javascript
import API from './api';

export const orderService = {
  getAll: async (params = {}) => {
    const response = await API.get('/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data.order;
  },

  getMyOrders: async () => {
    const response = await API.get('/orders/myorders');
    return response.data.orders;
  },

  create: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await API.put(`/orders/${id}`, statusData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/orders/${id}`);
    return response.data;
  },
};
```

## Step 4: Update Your Data Files

Replace localStorage calls with API calls. Example for `frontend/src/data/products.js`:

```javascript
import { productService } from '../services/productService';

export const loadProducts = async () => {
  try {
    const data = await productService.getAll();
    return data.products;
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to localStorage or return empty array
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  }
};

export const saveProducts = async (products) => {
  // This would now call API instead
  localStorage.setItem('products', JSON.stringify(products));
};
```

## Step 5: Update AuthContext

Update `frontend/src/context/AuthContext.jsx`:

```javascript
import { authService } from '../services/authService';

// In login function:
const login = async (email, password) => {
  try {
    const data = await authService.login(email, password);
    setUser(data.user);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

// In register function:
const register = async (userData) => {
  try {
    const data = await authService.register(userData);
    setUser(data.user);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
};
```

## Step 6: Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 7: Update CORS in Backend (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
```

## Example: Migrating Products Page

**Before (localStorage):**
```javascript
const products = loadProducts(); // From localStorage
```

**After (API):**
```javascript
import { productService } from '../services/productService';

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  fetchProducts();
}, []);
```

## Testing Flow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Seed Database:**
   ```bash
   node utils/seedData.js
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Test Login:**
   - Email: `admin@shop-e.com`
   - Password: `admin123`

5. **Verify API Connection:**
   - Check browser console for API calls
   - Check backend terminal for requests
   - Use Network tab in DevTools

## Common Issues

### Issue: CORS Error
**Solution:** Check CORS configuration in backend matches frontend URL

### Issue: 401 Unauthorized
**Solution:** Ensure token is being sent in Authorization header

### Issue: Connection Refused
**Solution:** Verify backend server is running on correct port

### Issue: MongoDB Connection Error
**Solution:** 
- Check MongoDB is running
- Verify connection string
- Check network connectivity

## Next Steps

1. Replace all localStorage operations with API calls
2. Add loading states for API requests
3. Add error handling for failed requests
4. Implement retry logic for failed requests
5. Add request caching if needed
6. Consider using React Query or SWR for better data fetching

## Production Deployment

### Backend
- Use PM2 or similar process manager
- Set `NODE_ENV=production`
- Use environment-specific MongoDB URI
- Enable SSL/TLS
- Use reverse proxy (Nginx)

### Frontend
- Build production bundle: `npm run build`
- Update `REACT_APP_API_URL` to production API URL
- Deploy to hosting service (Vercel, Netlify, etc.)

### Database
- Use MongoDB Atlas for production
- Enable authentication
- Set up backups
- Monitor performance

