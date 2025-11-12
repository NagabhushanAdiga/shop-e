# Vercel Environment Variables Setup

## 🔴 URGENT: Fix Database Connection Error

You're getting the error because environment variables are not set on Vercel.

## 📝 Step-by-Step Instructions

### 1. Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your backend project (`shop-e` backend)
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### 2. Add These Environment Variables

Add the following variables one by one:

#### Variable 1: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: 
```
mongodb+srv://nagbhushanadiga_db_user:PColLUPzUbCRzQGC@cluster0-ecomerce.0heeuul.mongodb.net/shop-e?retryWrites=true&w=majority&appName=Cluster0-ecomerce
```
- **Environment**: Check all (Production, Preview, Development)

#### Variable 2: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: 
```
shop-e-secret-key-2024-change-in-production-f8a9b3c2d1e4f5a6
```
- **Environment**: Check all

#### Variable 3: FRONTEND_URL
- **Name**: `FRONTEND_URL`
- **Value**: 
```
https://shop-e.vercel.app
```
- **Environment**: Check all

#### Variable 4: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: 
```
production
```
- **Environment**: Production only

#### Variable 5: JWT_EXPIRE
- **Name**: `JWT_EXPIRE`
- **Value**: 
```
7d
```
- **Environment**: Check all

### 3. Redeploy Your Backend

After adding all environment variables:

**Option A: Using Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**

**Option B: Using Git Push**
```bash
git add .
git commit -m "Fix: Add Vercel configuration"
git push origin main
```

**Option C: Using Vercel CLI**
```bash
cd backend
vercel --prod
```

### 4. Verify the Fix

After redeployment (wait 1-2 minutes), test:

```bash
# Health check
curl https://shop-e.vercel.app/api/health

# Database status
curl https://shop-e.vercel.app/api/setup/status

# Products endpoint (this was giving 500 error)
curl https://shop-e.vercel.app/api/products
```

All should return success responses now!

## 🎯 Quick Visual Guide

1. **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter variable name and value
4. Select environments (Production, Preview, Development)
5. Click **Save**
6. Repeat for all variables
7. Go to **Deployments** → **Redeploy**

## ✅ Expected Results

After setup:
- ✅ `/api/health` returns 200 OK
- ✅ `/api/setup/status` shows database info
- ✅ `/api/products` returns products (or empty array if no products yet)
- ✅ No more "ECONNREFUSED 127.0.0.1:27017" error

## 🔍 Troubleshooting

### Still Getting Connection Error?

1. **Check MongoDB Atlas**
   - Go to: https://cloud.mongodb.com/
   - Verify your cluster is running (not paused)
   - Check **Network Access** → Should have `0.0.0.0/0` (Allow access from anywhere)
   - OR add these Vercel IPs (gets complex, easier to use 0.0.0.0/0)

2. **Verify Environment Variables**
   - In Vercel Settings → Environment Variables
   - Make sure all 5 variables are present
   - Check for typos in variable names (case-sensitive!)
   - Ensure no extra spaces in values

3. **Check Deployment Logs**
   - Vercel Dashboard → Deployments → Click on latest deployment
   - Check **Function Logs** for error messages
   - Look for "MongoDB Connected Successfully" message

### MongoDB Atlas Network Access

If you get authentication errors:
1. Go to MongoDB Atlas dashboard
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

## 🚀 After Everything Works

Once the backend is working:

1. **Create Admin User**:
   ```bash
   curl -X POST https://shop-e.vercel.app/api/setup/create-admin
   ```

2. **Initialize Database** (creates categories):
   ```bash
   curl -X POST https://shop-e.vercel.app/api/setup/init
   ```

3. **Login with**:
   - Email: `admin@shop-e.com`
   - Password: `admin123`

## 📞 Need Help?

If you're still stuck:
1. Share the error message from Vercel Function Logs
2. Verify MongoDB Atlas cluster status
3. Double-check environment variable names and values

