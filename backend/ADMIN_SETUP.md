# Admin User Setup Guide

This guide explains how to create an admin user for the Shop-E backend.

## Default Admin Credentials

Once created, the default admin credentials are:
- **Email:** `admin@shop-e.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the password after your first login!

## Method 1: Local Setup (Running Locally)

If you're running the backend locally:

```bash
cd backend
npm run create-admin
```

This will:
- Connect to your MongoDB database
- Create an admin user
- Display the credentials

## Method 2: Vercel/Production Setup (Using API Endpoint)

If your backend is deployed on Vercel, you can create the admin user via API:

### Option A: Create Admin Only

Send a POST request to:
```
https://shop-e.vercel.app/api/setup/create-admin
```

Using curl:
```bash
curl -X POST https://shop-e.vercel.app/api/setup/create-admin
```

Using JavaScript/Fetch:
```javascript
fetch('https://shop-e.vercel.app/api/setup/create-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Option B: Initialize Entire Database

This creates admin user AND sample categories:
```bash
curl -X POST https://shop-e.vercel.app/api/setup/init
```

### Check Database Status

To check if the admin user exists:
```bash
curl https://shop-e.vercel.app/api/setup/status
```

## Method 3: Full Database Seeding (Local Only)

To seed the entire database with sample data (users, categories, products):

```bash
cd backend
npm run seed
```

⚠️ **WARNING:** This will delete ALL existing data and create fresh sample data.

## Troubleshooting

### Admin Already Exists

If you see "Admin user already exists", the setup is complete. Use the default credentials to login.

### Database Connection Error

Make sure your `MONGODB_URI` environment variable is set in:
- Local: `.env` file in the backend directory
- Vercel: Environment Variables in project settings

### Can't Access Setup Endpoints

The setup endpoints are public by design for initial setup. After creating your admin user, you should consider:
1. Removing the setup routes in production
2. Or protecting them with authentication
3. Or using environment-based access control

## Security Recommendations

1. **Change Default Password:** Immediately after first login, change the admin password
2. **Disable Setup Routes:** After initial setup, consider commenting out or removing the setup route in `server.js`
3. **Use Strong Passwords:** When changing the password, use a strong, unique password
4. **Enable 2FA:** If implementing 2FA, enable it for admin accounts

## Next Steps

After creating the admin user:
1. Login to the admin dashboard: `https://shop-e.vercel.app/admin`
2. Change your password in Settings
3. Create categories and products
4. Configure payment settings

## Support

If you encounter issues:
1. Check the server logs (Vercel Function Logs)
2. Verify MongoDB connection
3. Ensure environment variables are set correctly

