# Fix Vercel Backend Deployment - NPM Authentication Error

## The Problem
You're getting: `npm error code E401 - Unable to authenticate`

This happens because:
1. Vercel is building from the repo root (includes both frontend and backend)
2. You need to configure Vercel to deploy ONLY the backend folder

---

## ✅ SOLUTION: Configure Vercel Project Settings

### Method 1: Via Vercel Dashboard (RECOMMENDED) ⭐

#### Step 1: Open Project Settings
1. Go to: https://vercel.com/dashboard
2. Click on your **backend project**
3. Click **"Settings"** tab (top navigation)

#### Step 2: Set Root Directory
1. Scroll down to **"Build & Development Settings"** section
2. Find **"Root Directory"**
3. Click **"Edit"** next to it
4. Enter: `backend`
5. Click **"Save"**

#### Step 3: Configure Build Settings (if needed)
In the same "Build & Development Settings" section:

- **Framework Preset:** Other
- **Build Command:** Leave empty or set to: `npm install`
- **Output Directory:** Leave empty
- **Install Command:** `npm install` (or leave default)

Click **"Save"**

#### Step 4: Add Environment Variables (if not done yet)
1. Go to **"Environment Variables"** (left sidebar)
2. Add these 5 variables (see STEP_BY_STEP_FIX.txt for values):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `FRONTEND_URL`
   - `NODE_ENV`

#### Step 5: Redeploy
1. Go to **"Deployments"** tab
2. Click **••• (three dots)** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

### Method 2: Via Git Push

If Method 1 doesn't work, try this:

#### Step 1: Commit the fixes I just made
```bash
git add backend/.npmrc backend/vercel.json
git commit -m "Fix: Add .npmrc and update vercel.json for deployment"
git push origin main
```

This will:
- Add a proper `.npmrc` file in backend (uses public npm registry)
- Update `vercel.json` with better install command

#### Step 2: Still set Root Directory in Vercel
You MUST set the root directory to `backend` in Vercel settings (see Method 1, Step 2)

---

### Method 3: Create New Vercel Project (If all else fails)

If the above doesn't work:

1. **Delete the current backend project** from Vercel dashboard
2. **Create a new project:**
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - **IMPORTANT:** Before deploying, click "Configure Project"
   - Set **Root Directory** to: `backend`
   - Set **Framework Preset** to: Other
   - Add all 5 environment variables
   - Click "Deploy"

---

## 🔍 Why This Happened

Your repository structure is:
```
shop-e/
├── frontend/        ← Has its own package.json
│   └── .npmrc
├── backend/         ← Has its own package.json
│   └── (newly added) .npmrc
└── ...
```

When Vercel builds from the root, it gets confused about which `package.json` to use and may pick up authentication settings from frontend.

**Solution:** Tell Vercel to ONLY build from the `backend/` folder.

---

## ✅ After Fixing

Once deployed successfully, test:

```bash
# Should work without 401 errors
curl https://shop-e.vercel.app/api/health
curl https://shop-e.vercel.app/api/setup/status
```

---

## 📋 Quick Checklist

- [ ] Set **Root Directory** to `backend` in Vercel project settings
- [ ] Add all 5 environment variables (MONGODB_URI, JWT_SECRET, etc.)
- [ ] Redeploy the project
- [ ] Wait 1-2 minutes for deployment
- [ ] Test endpoints with curl or test-backend.html

---

## 🆘 Still Having Issues?

If you still get errors:

1. **Check Vercel Build Logs:**
   - Deployments → Click on deployment → View logs
   - Look for the actual error message

2. **Verify Root Directory:**
   - Settings → General → Root Directory should show: `backend`

3. **Check Environment Variables:**
   - Settings → Environment Variables
   - Should have all 5 variables listed

4. **Try creating a fresh project** (Method 3 above)

---

## 📝 Files I Updated

1. ✅ `backend/.npmrc` - Created (uses public npm registry)
2. ✅ `backend/vercel.json` - Updated (added installCommand)

Now commit and push these changes, then follow Method 1 above!

