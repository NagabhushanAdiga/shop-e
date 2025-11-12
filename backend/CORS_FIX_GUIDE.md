# CORS Error Fix Guide

## ✅ Changes Made to Fix CORS Errors

### 1. Updated `server.js` - Enhanced CORS Configuration

**Key Changes:**
- Moved CORS configuration **before** other middleware
- Added support for multiple frontend origins
- Configured helmet to work with CORS
- Added proper preflight request handling
- Enabled all necessary HTTP methods and headers

### 2. CORS Configuration Details

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allows requests from:
    // - http://localhost:3000
    // - http://localhost:3001
    // - http://127.0.0.1:3000
    // - Custom FRONTEND_URL from .env
    // - No origin (mobile apps, Postman, etc.)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};
```

### 3. Helmet Configuration Updated

Fixed helmet to work with CORS:
```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: false, // Disabled for API
}));
```

## 📝 Required: Create .env File

**IMPORTANT:** You need to manually create a `.env` file in the `backend` folder:

### Steps:

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create `.env` file with this content:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/shop-e

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # JWT Secret
   JWT_SECRET=shop-e-secret-key-2024-change-in-production
   JWT_EXPIRE=7d

   # Other Configuration
   UPLOADS_DIR=./uploads

   # Payment Gateway (Optional)
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   ```

3. **Save the file** as `.env` (with the dot at the beginning)

## 🚀 How to Test the Fix

### 1. Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000 in development mode
📝 API available at http://localhost:5000/api
```

### 2. Test CORS from Frontend

Start your frontend:
```bash
cd frontend
npm start
```

### 3. Check Browser Console

Open browser DevTools (F12) and check:
- ✅ No CORS errors
- ✅ API requests succeed
- ✅ 200 status codes

### 4. Test API Health Endpoint

Open in browser: `http://localhost:5000/api/health`

Should return:
```json
{
  "success": true,
  "message": "Shop-E API is running",
  "timestamp": "2024-..."
}
```

## 🔍 Common CORS Issues & Solutions

### Issue 1: "No 'Access-Control-Allow-Origin' header"
**Solution:** ✅ Fixed by enhanced CORS configuration

### Issue 2: "CORS policy: credentials mode"
**Solution:** ✅ Fixed with `credentials: true`

### Issue 3: "Method not allowed"
**Solution:** ✅ Fixed by adding all methods in corsOptions

### Issue 4: "Preflight request failed"
**Solution:** ✅ Fixed with `app.options('*', cors(corsOptions))`

### Issue 5: Helmet blocking requests
**Solution:** ✅ Fixed by configuring helmet for CORS

## 🛠️ Development vs Production

### Development (Current Setup):
- Allows all origins for easy testing
- localhost:3000, 3001, 127.0.0.1:3000 supported
- Credentials enabled
- All HTTP methods allowed

### Production (Recommended):
Update `server.js` corsOptions to be more restrictive:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Only your production domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

## 📋 Checklist

- [x] Updated server.js with enhanced CORS
- [ ] Created .env file in backend folder
- [ ] Restarted backend server
- [ ] Tested from frontend
- [ ] Verified no CORS errors in console

## 🔧 Troubleshooting

### Still getting CORS errors?

1. **Check Backend is Running:**
   ```bash
   # Should show: Server running on port 5000
   ```

2. **Check Frontend API URL:**
   - Open `frontend/src/services/api.js`
   - Verify: `baseURL: 'http://localhost:5000/api'`

3. **Check Browser:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard reload (Ctrl+Shift+R)
   - Try incognito mode

4. **Check Network Tab:**
   - Open DevTools → Network
   - Look for failed requests
   - Check request/response headers

5. **Verify Ports:**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - No port conflicts

### Still not working?

**Manual CORS bypass for testing only:**

In `server.js`, temporarily add after line 52:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

⚠️ **Remove this in production!**

## 📚 Additional Resources

- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Helmet Security](https://helmetjs.github.io/)

## ✅ Summary

The CORS configuration has been updated to:
1. ✅ Allow multiple frontend origins
2. ✅ Handle preflight OPTIONS requests
3. ✅ Configure helmet for API usage
4. ✅ Enable credentials and all HTTP methods
5. ✅ Support development and production modes

**Next Step:** Create the `.env` file and restart your backend server!

