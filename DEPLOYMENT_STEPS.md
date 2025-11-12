# Shop-E Deployment Steps

## 🔧 Backend Setup (Vercel)

### 1. Backend Deployment Files Created
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/utils/createAdmin.js` - Admin creation script
- ✅ `backend/routes/setup.js` - Setup API endpoints
- ✅ `backend/ADMIN_SETUP.md` - Complete setup guide

### 2. Deploy Backend to Vercel

**Option A: Via Vercel CLI**
```bash
cd backend
vercel --prod
```

**Option B: Via Git Integration**
1. Push your code to GitHub
2. Connect the repository to Vercel
3. Set the root directory to `backend`
4. Deploy

### 3. Set Environment Variables on Vercel

In your Vercel project settings, add:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
FRONTEND_URL=https://shop-e.vercel.app
JWT_SECRET=your_secret_key_here
```

### 4. Create Admin User

After deployment, create the admin user by visiting:
```
https://your-backend-url.vercel.app/api/setup/create-admin
```

Or use curl:
```bash
curl -X POST https://your-backend-url.vercel.app/api/setup/create-admin
```

### 5. Test the API

Check if everything is working:
```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Database status
curl https://your-backend-url.vercel.app/api/setup/status

# Get products
curl https://your-backend-url.vercel.app/api/products
```

## 🎨 Frontend Setup (Already Deployed)

Your frontend is at: `https://shop-e.vercel.app`

### Update API Configuration

Make sure the frontend points to your backend. Check `frontend/src/config/apiConfig.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';
```

Set in Vercel frontend environment variables:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## 📝 Default Credentials

After setup:
- **Admin Email:** admin@shop-e.com
- **Admin Password:** admin123

⚠️ **Change this password immediately after first login!**

## 🔍 Troubleshooting the 500 Error

The 500 error you're experiencing is likely due to:

1. **Missing vercel.json** ✅ Fixed - Created configuration file
2. **Database not connected** - Check MongoDB URI in Vercel env vars
3. **Serverless function timeout** ✅ Fixed - Improved connection handling
4. **No admin user** ✅ Fixed - Setup endpoints created

## 🚀 Quick Fix Steps

1. **Deploy the updated backend:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Verify MongoDB connection:**
   - Check your MongoDB Atlas cluster is running
   - Verify the connection string in Vercel environment variables
   - Whitelist Vercel IPs (or use 0.0.0.0/0 for testing)

3. **Create admin user:**
   ```bash
   curl -X POST https://your-backend-url.vercel.app/api/setup/create-admin
   ```

4. **Test the products endpoint:**
   ```bash
   curl https://your-backend-url.vercel.app/api/products
   ```

## 📊 Monitoring

View logs in:
- Vercel Dashboard → Your Project → Functions
- Check for MongoDB connection errors
- Look for timeout issues

## ✅ Success Indicators

Your backend is working when:
- [ ] Health check returns 200: `/api/health`
- [ ] Status shows database info: `/api/setup/status`
- [ ] Products endpoint works: `/api/products`
- [ ] You can login with admin credentials

## 🆘 Still Getting 500 Error?

Check these in order:
1. Vercel Function Logs for specific error messages
2. MongoDB Atlas - Network Access and Database Access
3. Environment variables are set correctly
4. The database has at least categories (create via setup endpoint)
5. Products reference valid category IDs

