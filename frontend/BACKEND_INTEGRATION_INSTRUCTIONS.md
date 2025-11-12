# Backend Integration Instructions

## 🎯 Quick Start Guide

Your Shop-E application now supports **DUAL MODE** operation:
- **Mode 1**: LocalStorage (current) - Works without backend
- **Mode 2**: API Integration - Full backend integration

## 🔧 How to Enable Backend

### Step 1: Start Backend Server

```bash
# Terminal 1 - Start Backend
cd backend
npm install
node utils/seedData.js  # First time only
npm run dev
```

Backend runs at: `http://localhost:5000`

### Step 2: Enable API in Frontend

Update `frontend/.env`:
```env
REACT_APP_USE_API=true
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Restart Frontend

```bash
# Terminal 2 - Restart Frontend
cd frontend
npm start
```

Frontend runs at: `http://localhost:3000`

## 📦 What's Been Set Up

### ✅ API Services Created

All services are ready in `frontend/src/services/`:

1. **api.js** - Base API client with:
   - Automatic token injection
   - Error handling
   - Response interceptors
   - 401 redirect to login

2. **authService.js** - Authentication:
   - register()
   - login()
   - logout()
   - getCurrentUser()
   - updatePassword()

3. **productService.js** - Products:
   - getAll()
   - getById()
   - create()
   - update()
   - delete()
   - search()

4. **orderService.js** - Orders:
   - getAll()
   - getById()
   - getMyOrders()
   - create()
   - updateStatus()
   - delete()

5. **userService.js** - Users:
   - getAll()
   - getById()
   - create()
   - update()
   - delete()

6. **categoryService.js** - Categories:
   - getAll()
   - getById()
   - create()
   - update()
   - delete()

7. **feedbackService.js** - Feedback:
   - getAll()
   - getById()
   - create()
   - respond()
   - updateStatus()
   - delete()

8. **reportService.js** - Reports:
   - getDashboardStats()
   - getSalesReport()
   - getCustomerReport()
   - getProductReport()

9. **paymentService.js** - Payments:
   - initiateUPIPayment()
   - initiatePhonePePayment()
   - initiateGooglePayPayment()
   - processCardPayment()
   - verifyPayment()

### ✅ Helper Utilities

1. **apiHelper.js** - Smart data manager:
   - Automatic fallback to localStorage
   - Backend availability checking
   - Seamless switching between API/localStorage

2. **useAPI.js** - React hooks:
   - `useAPI()` - For data fetching
   - `useMutation()` - For create/update/delete

3. **apiConfig.js** - Configuration:
   - Feature flags
   - API settings
   - Backend health check

## 🔄 How It Works

### Automatic Fallback System

The app automatically:
1. Checks if backend is available
2. Uses API if available
3. Falls back to localStorage if not
4. Caches API responses locally

### Example Usage

```javascript
// In your component:
import { useAPI } from '../hooks/useAPI';
import { productService } from '../services/productService';

const MyComponent = () => {
  const { data: products, loading, error } = useAPI(
    () => productService.getAll(),
    'products',
    [] // fallback data
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

## 🚦 Current Setup

### What Works NOW (Without Backend):
✅ All pages function normally
✅ Data stored in localStorage
✅ Full CRUD operations
✅ Authentication (mock)
✅ Orders and cart
✅ Admin panel
✅ All features working

### What Works WITH Backend:
✅ Real database (MongoDB)
✅ Secure authentication (JWT)
✅ Data persistence
✅ Multi-user support
✅ Production-ready
✅ API security
✅ Scalable architecture

## 📝 Migration Steps (When Ready)

### Phase 1: Authentication
1. Update `AuthContext.jsx` to use `authService`
2. Test login/register/logout
3. Verify token storage

### Phase 2: Products
1. Update product loading to use `productService`
2. Test product CRUD in admin
3. Verify public product viewing

### Phase 3: Orders
1. Update checkout to use `orderService`
2. Test order creation
3. Verify admin order management

### Phase 4: Other Features
1. Update users, categories, feedback
2. Test all admin features
3. Verify data synchronization

## 🔐 Default Backend Credentials

After running `seedData.js`:
- **Admin**: admin@shop-e.com / admin123
- **User**: john@example.com / password123

## 🎮 Testing the Integration

### Test Backend is Running:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Shop-E API is running"
}
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shop-e.com","password":"admin123"}'
```

### Test in Frontend:
1. Open browser console
2. Check Network tab for API calls
3. Look for requests to `localhost:5000`

## 🌐 Environment Variables

### Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_USE_API=false  # Set to true to enable
```

### Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop-e
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

## 🚀 Production Deployment

### Frontend:
1. Build: `npm run build`
2. Set `REACT_APP_USE_API=true`
3. Update `REACT_APP_API_URL` to production API
4. Deploy to Vercel/Netlify

### Backend:
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas
3. Set strong JWT secret
4. Deploy to Heroku/Railway/DigitalOcean
5. Enable HTTPS

## 💡 Smart Features

### Automatic Fallback
If backend is down, app automatically uses localStorage

### Seamless Switching
Toggle `REACT_APP_USE_API` without code changes

### Development Friendly
Work offline with mock data, connect to API when ready

### Production Ready
Full backend integration available when needed

## 📚 Documentation Files

- `backend/README.md` - Complete API documentation
- `backend/SETUP.md` - Backend setup guide
- `backend/FRONTEND_INTEGRATION.md` - Integration details
- `frontend/PAYMENT_GATEWAY_GUIDE.md` - Payment integration

## 🎯 Next Steps

**Option A: Continue with LocalStorage** (Current)
- Everything works as-is
- No backend needed
- Perfect for development/demo

**Option B: Enable Backend Integration**
1. Start backend server
2. Set `REACT_APP_USE_API=true`
3. Test all features
4. Deploy when ready

## 🆘 Troubleshooting

**CORS Error:**
- Update `FRONTEND_URL` in backend `.env`
- Check backend CORS configuration

**Connection Refused:**
- Ensure backend is running: `npm run dev`
- Check port 5000 is not in use

**401 Errors:**
- Check token in localStorage
- Verify JWT_SECRET matches
- Re-login to get new token

**Data Not Showing:**
- Run seed script: `node utils/seedData.js`
- Check MongoDB is running
- Verify database connection

## ✨ You're All Set!

Your application now has:
✅ Complete backend API ready to use
✅ Dual-mode operation (localStorage + API)
✅ Automatic fallback system
✅ Production-ready structure
✅ Easy switching between modes

Enable backend when you're ready, or keep using localStorage for development!

