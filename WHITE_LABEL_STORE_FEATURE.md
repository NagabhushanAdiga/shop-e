# White-Label Store Customization Feature 🏪

## Overview

Your Shop-E platform is now a **fully customizable white-label e-commerce solution**! Admins can change the store name, logo, contact info, and branding - making it suitable for ANY e-commerce business.

---

## ✅ Features Added

### 1. **Store Branding & Information**
Control ALL text and branding throughout the platform:

#### Basic Information:
- **Store Name** - Appears in header, title, footer, everywhere!
- **Store Tagline** - Shown in hero section and meta descriptions
- **Logo URL** - Custom logo image (replaces default icon)
- **Favicon URL** - Browser tab icon

#### Contact Information:
- **Contact Email** - Support email shown in footer
- **Contact Phone** - Support phone shown in footer
- **Store Address** - Physical address displayed in footer

#### Business Configuration:
- **Free Shipping Threshold** - Orders above this get free shipping (in ₹)
- **Tax Rate** - GST or tax percentage (default 18%)

#### Social Media Links:
- Facebook URL
- Twitter URL
- Instagram URL
- LinkedIn URL

#### Footer & Policies:
- **Footer Text** - Copyright/tagline text
- **About Us** - Store description
- **Return Policy** - Return/refund policy text

---

## 🎯 How It Works

### Backend (API):
**New Model:** `StoreSetting` (MongoDB)
- Stores all customizable settings
- Single document for all settings
- Automatically creates defaults if none exist

**New Routes:**
- `GET /api/store-settings` - Fetch settings (Public)
- `PUT /api/store-settings` - Update settings (Admin only)
- `POST /api/store-settings/reset` - Reset to defaults (Admin only)

### Frontend (UI):
**New Context:** `StoreSettingsContext`
- Provides settings throughout the app
- Caches in localStorage for performance
- Auto-refreshes on updates

**Updated Components:**
- **Header** - Uses custom store name & logo
- **Footer** - Uses custom contact info, about text, social links
- **Settings Page** - Full admin control panel

---

## 📝 How to Use

### For Admins:

#### Step 1: Access Settings
1. Login as admin: `admin@shop-e.com` / `admin123`
2. Go to: **Settings** (in sidebar)
3. See **"Store Branding & Information"** section (blue border)

#### Step 2: Customize Your Store
Fill in all fields:

**Basic Info:**
```
Store Name: My Awesome Store
Store Tagline: Best Products, Best Prices
Logo URL: https://yourcdn.com/logo.png
Favicon URL: https://yourcdn.com/favicon.ico
```

**Contact:**
```
Email: support@mystore.com
Phone: +91 98765 43210
Address: 456 Market Street, Mumbai, India
```

**Business:**
```
Free Shipping: ₹999 (orders above get free shipping)
Tax Rate: 18% (GST)
```

**Social Media:**
```
Facebook: https://facebook.com/mystore
Instagram: https://instagram.com/mystore
Twitter: https://twitter.com/mystore
LinkedIn: https://linkedin.com/company/mystore
```

**About & Policies:**
```
Footer Text: Quality products since 2024
About Us: We are India's leading online retailer...
Return Policy: 7-day return policy on all items
```

#### Step 3: Save
Click **"Save Store Settings"** button

#### Step 4: See Changes
Refresh the page (F5) and see your custom branding everywhere!

---

## 🌐 Where Settings Appear

### Store Name appears in:
- ✅ Header (top left)
- ✅ Browser title (tab)
- ✅ Footer copyright
- ✅ About section heading
- ✅ All emails/notifications
- ✅ Reports and exports

### Logo appears in:
- ✅ Header (replaces default store icon)
- ✅ Can be shown in invoices/exports

### Contact Info appears in:
- ✅ Footer (email, phone, address)
- ✅ Contact us pages
- ✅ Order confirmation emails

### Social Media links appear in:
- ✅ Footer (only icons for links you provide)
- ✅ Share buttons

### Policies appear in:
- ✅ Checkout page (return policy)
- ✅ Footer (about us)
- ✅ Policy pages

---

## 🎨 Use Cases

### Use Case 1: Electronics Store
```
Store Name: TechHub India
Tagline: Your Technology Partner
Logo: Custom TechHub logo
Free Shipping: ₹2999
About: Leading electronics retailer in India
```

### Use Case 2: Fashion Store
```
Store Name: StyleVilla
Tagline: Fashion That Inspires
Logo: StyleVilla brand logo
Free Shipping: ₹1499
About: Trendy fashion for modern lifestyle
```

### Use Case 3: Grocery Store
```
Store Name: FreshMart
Tagline: Fresh Daily Essentials
Logo: FreshMart logo with basket
Free Shipping: ₹499
About: Farm-fresh groceries delivered daily
```

---

## 🔧 Technical Implementation

### Database Schema (MongoDB):
```javascript
{
  storeName: String,
  storeTagline: String,
  logo: String,
  favicon: String,
  contactEmail: String,
  contactPhone: String,
  address: String,
  freeShippingThreshold: Number,
  taxRate: Number,
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  footerText: String,
  aboutUs: String,
  returnPolicy: String,
  // ... more fields
}
```

### Context Usage:
```javascript
import { useStoreSettings } from '../context/StoreSettingsContext';

const MyComponent = () => {
  const { storeSettings } = useStoreSettings();
  
  return (
    <div>
      <h1>{storeSettings.storeName}</h1>
      <p>{storeSettings.storeTagline}</p>
    </div>
  );
};
```

---

## 📦 Files Created/Modified

### Backend:
1. ✅ `backend/models/StoreSetting.js` - Database model
2. ✅ `backend/controllers/storeSettingController.js` - API controller
3. ✅ `backend/routes/storeSettings.js` - API routes
4. ✅ `backend/server.js` - Added route + CORS fix

### Frontend:
5. ✅ `frontend/src/context/StoreSettingsContext.jsx` - Global context
6. ✅ `frontend/src/services/storeSettingService.js` - API service
7. ✅ `frontend/src/App.jsx` - Added provider
8. ✅ `frontend/src/components/Header.jsx` - Uses custom name/logo
9. ✅ `frontend/src/components/Footer.jsx` - Uses custom contact/social
10. ✅ `frontend/src/pages/admin/Settings.jsx` - Admin control panel

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend
```bash
git add backend/
git commit -m "Add white-label store customization feature"
git push origin main
```

### Step 2: Deploy Frontend
```bash
git add frontend/
git commit -m "Add store settings context and admin control panel"
git push origin main
```

### Step 3: Initialize Settings
After deployment, visit:
```
https://shop-e-server.vercel.app/api/store-settings
```
This will create default settings in database.

### Step 4: Customize
1. Login to admin panel
2. Go to Settings
3. Update all fields
4. Save and refresh!

---

## 🧪 Testing

### Test 1: Default Settings
1. Open app before customization
2. Should see "Shop-E" everywhere
3. Default contact info in footer

### Test 2: Custom Branding
1. Login as admin
2. Go to Settings → Store Branding
3. Change "Store Name" to "MyShop"
4. Add logo URL
5. Save and refresh
6. Header should show "MyShop" and custom logo
7. Footer should show "MyShop" in copyright

### Test 3: Social Media
1. Add Instagram URL in settings
2. Save and refresh
3. Footer should show Instagram icon
4. Click icon → Opens your Instagram page

---

## 🎨 Customization Examples

### Minimal Setup (Just Name):
```
Store Name: QuickMart
(Keep everything else default)
```
Result: "QuickMart" appears everywhere instead of "Shop-E"

### Full Branding:
```
Store Name: EliteFashion
Tagline: Luxury Fashion for Everyone
Logo: https://cdn.elitefashion.com/logo.png
Email: hello@elitefashion.com
Phone: +91 11 1234 5678
Instagram: https://instagram.com/elitefashion
Facebook: https://facebook.com/elitefashion
About: Premium fashion boutique serving India since 2024
Footer: Redefining fashion, one outfit at a time
```

---

## 💡 Advanced Features

### Dynamic Page Title:
The browser tab title will automatically use your store name.

### Logo Guidelines:
- **Recommended size:** 200x60 pixels
- **Format:** PNG with transparent background
- **Max file size:** 500KB
- **Aspect ratio:** 3:1 (horizontal logo works best)

### Favicon Guidelines:
- **Size:** 32x32 or 64x64 pixels
- **Format:** .ico or .png
- **Must be square**

### Social Media:
- Only icons for links you provide appear
- Empty links = icon doesn't show
- Opens in new tab when clicked

---

## 🔒 Security Notes

### Admin-Only Access:
- Only admins can change store settings
- Public users can only view (read-only)
- Settings are cached in localStorage for performance

### Database:
- Single document stores all settings
- Auto-creates if doesn't exist
- Can reset to defaults anytime

---

## 📊 Benefits

### For You:
- ✅ One codebase for multiple stores
- ✅ Easy client customization
- ✅ No code changes needed
- ✅ Professional white-label solution

### For Clients:
- ✅ Complete branding control
- ✅ Easy to manage
- ✅ No technical knowledge required
- ✅ See changes instantly

---

## 🎉 Result

Your platform can now be used by:
- Electronics stores
- Fashion boutiques
- Grocery chains
- Book stores
- Any e-commerce business!

Just change the settings and it becomes their branded store! 🚀

---

## 📞 Support

### To Add More Customizable Fields:
1. Add field to `StoreSetting` model
2. Add field to Settings UI
3. Use field in components via `useStoreSettings()`

### To Add Logo Upload:
Consider integrating:
- Cloudinary
- AWS S3
- Vercel Blob Storage

Currently uses URL input for simplicity.

---

## ✨ Summary

You now have a complete white-label e-commerce platform where every store can have:
- ✅ Custom name
- ✅ Custom logo
- ✅ Custom contact info
- ✅ Custom social media
- ✅ Custom policies
- ✅ Custom business rules

All controlled from one admin settings page! 🎊

