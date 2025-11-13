# Dynamic Titles & File Upload Feature

## ✅ Features Completed

### 1. **Dynamic Browser Tab Titles - ALL Pages!** ✅

**Now Works On:**

#### User Pages:
- 🏠 Home → `StoreName - Tagline`
- 📦 Products → `Products - StoreName`
- 🛒 Shopping Cart → `Shopping Cart - StoreName`
- 🔐 Login → `Login - StoreName`
- 📝 Signup → `Signup - StoreName` (if added)
- 📋 Checkout → `Checkout - StoreName` (if added)

#### Admin Pages:
- 📊 Dashboard → `Admin Dashboard - StoreName`
- 📂 Categories → `Categories - StoreName`
- 👥 Users → `Users Management - StoreName`
- 📦 Orders → `Orders - StoreName`
- ⚙️ Settings → `Settings - StoreName`
- 📈 Reports → `Reports & Analytics - StoreName`
- 💬 Feedback → `User Feedback - StoreName`

**How It Works:**
```javascript
// In any component:
import { useDynamicTitle } from '../hooks/useDynamicTitle';

// Use it:
useDynamicTitle('Page Name'); // Shows: Page Name - StoreName
useDynamicTitle();            // Shows: StoreName - Tagline
```

**Example:**
- Admin changes store name to "TechMart"
- Products page tab shows: `Products - TechMart`
- Home page tab shows: `TechMart - Your Shopping Partner`
- Admin Dashboard shows: `Admin Dashboard - TechMart`

---

### 2. **File Upload for Logo & Favicon** ✅

**Location:** Settings → Store Branding & Information

#### Logo Upload:
**Two Ways to Add:**
1. **Upload from Device:**
   - Click "Upload from Device" button
   - Select image from your computer
   - Preview appears on the right
   - Automatically converts to base64 and saves

2. **Paste URL:**
   - Enter image URL in text field
   - Image loads from URL

**Features:**
- ✅ Live preview (80x80px box)
- ✅ Accepts any image format (PNG, JPG, GIF, etc.)
- ✅ Base64 encoding for uploaded files
- ✅ Stored directly in MongoDB
- ✅ No external storage needed

#### Favicon Upload:
**Same as Logo:**
1. Upload from device OR paste URL
2. Live preview (60x60px box)
3. Base64 encoded
4. Automatically updates browser tab icon

**Recommended Sizes:**
- **Logo:** 200x60 pixels (horizontal)
- **Favicon:** 32x32 pixels (square)

---

## 🎯 Complete Workflow

### Admin Customizes Store:

#### Step 1: Upload Logo
1. Go to Settings → Store Branding
2. Find "Store Logo" section
3. Click "Upload from Device"
4. Select logo file (e.g., mylogo.png)
5. See preview appear
6. Scroll down and click "Save Store Settings"

#### Step 2: Upload Favicon
1. Same section, find "Favicon"
2. Click "Upload from Device"
3. Select favicon file (32x32 square icon)
4. See preview appear
5. Save settings

#### Step 3: Change Store Name
1. In same form, change "Store Name" to "MyStore"
2. Save settings

#### Step 4: See Changes
1. Refresh browser (F5)
2. **Header:** Shows your uploaded logo + "MyStore"
3. **Browser tab:** Shows your uploaded favicon
4. **Browser title:** Shows "MyStore - Your Shopping Partner"
5. Navigate to Products page
6. **Browser title:** Changes to "Products - MyStore"

---

## 🔧 Technical Implementation

### File Upload Process:
```javascript
1. User selects file
   ↓
2. FileReader reads file as Data URL
   ↓
3. Converts to base64 string
   ↓
4. Stores in state + localStorage
   ↓
5. Saves to MongoDB
   ↓
6. Image displays throughout app
```

### Base64 Storage:
**Advantages:**
- ✅ No external storage needed
- ✅ No CDN required
- ✅ Works immediately
- ✅ No upload API needed
- ✅ Stored directly in MongoDB

**Considerations:**
- File size increases (base64 is ~33% larger)
- Recommended for small images (logo/favicon)
- For large images, use URL input with CDN

### Dynamic Title Hook:
```javascript
export const useDynamicTitle = (pageTitle = '') => {
  const { storeSettings } = useStoreSettings();

  useEffect(() => {
    // Update document.title
    const storeName = storeSettings?.storeName || 'Shop-E';
    const fullTitle = pageTitle 
      ? `${pageTitle} - ${storeName}`
      : `${storeName} - ${storeSettings?.storeTagline || 'Your Online Store'}`;
    
    document.title = fullTitle;

    // Update favicon
    if (storeSettings?.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeSettings.favicon;
    }
  }, [storeSettings, pageTitle]);
};
```

---

## 📸 UI Design

### Logo Upload Section:
```
┌─────────────────────────────────────────────┐
│ Store Logo                                  │
│ Upload logo or paste image URL              │
├─────────────────────────────────────────────┤
│ [Logo URL Text Field              ]  ┌─────┐│
│ [Upload from Device Button        ]  │Logo ││
│                                       │Prev-││
│                                       │iew  ││
│                                       └─────┘│
└─────────────────────────────────────────────┘
```

### Favicon Upload Section:
```
┌─────────────────────────────────────────────┐
│ Favicon                                     │
│ Upload favicon or paste URL (32x32px)       │
├─────────────────────────────────────────────┤
│ [Favicon URL Text Field           ]  ┌────┐│
│ [Upload from Device Button        ]  │Fav ││
│                                       │icon││
│                                       └────┘│
└─────────────────────────────────────────────┘
```

---

## 🎨 Example Use Cases

### Case 1: Upload Custom Logo
**TechMart Store:**
1. Upload techmart-logo.png (200x60)
2. Upload techmart-icon.png (32x32)
3. Change name to "TechMart"
4. Save
5. **Result:**
   - Header shows TechMart logo
   - Browser tab shows TechMart icon
   - All page titles: "Page - TechMart"

### Case 2: Use URL for Images
**FashionHub Store:**
1. Paste logo URL: `https://cdn.fashionhub.com/logo.png`
2. Paste favicon URL: `https://cdn.fashionhub.com/icon.ico`
3. Change name to "FashionHub"
4. Save
5. **Result:**
   - Images load from CDN
   - Same dynamic behavior

### Case 3: Mix Both Methods
1. Upload logo from device (base64)
2. Use URL for favicon (external)
3. Both work together!

---

## 📦 Files Modified

### Dynamic Titles Added To:
1. ✅ `frontend/src/hooks/useDynamicTitle.js` - Created hook
2. ✅ `frontend/src/pages/Home.jsx`
3. ✅ `frontend/src/pages/Products.jsx`
4. ✅ `frontend/src/pages/Cart.jsx`
5. ✅ `frontend/src/pages/Login.jsx`
6. ✅ `frontend/src/pages/admin/Dashboard.jsx`
7. ✅ `frontend/src/pages/admin/Categories.jsx`
8. ✅ `frontend/src/pages/admin/Users.jsx`
9. ✅ `frontend/src/pages/admin/Orders.jsx`
10. ✅ `frontend/src/pages/admin/Settings.jsx`
11. ✅ `frontend/src/pages/admin/Reports.jsx`
12. ✅ `frontend/src/pages/admin/Feedback.jsx`

### File Upload Added To:
13. ✅ `frontend/src/pages/admin/Settings.jsx` - Logo & favicon upload

---

## 🧪 Testing

### Test 1: Dynamic Titles
1. Open any page
2. Check browser tab title
3. Go to Settings → Change store name to "TestStore"
4. Save and refresh
5. Check browser tab → Should show "TestStore"
6. Navigate to different pages
7. Each page title should include "TestStore"

### Test 2: Logo Upload
1. Go to Settings
2. Click "Upload from Device" under Logo
3. Select an image file (PNG/JPG)
4. See preview appear
5. Click "Save Store Settings"
6. Refresh page
7. Header should show your uploaded logo

### Test 3: Favicon Upload
1. Same as logo test
2. After saving, check browser tab
3. Should see your custom icon instead of default

### Test 4: URL Method
1. Paste image URL instead of uploading
2. Save
3. Image loads from URL

---

## 💾 Storage Methods

### Option 1: Upload from Device (Base64)
**Pros:**
- ✅ Works immediately
- ✅ No external dependencies
- ✅ Stored in MongoDB
- ✅ Always available

**Cons:**
- ❌ Increases database size
- ❌ ~33% larger than original

**Best for:** Logo, favicon, small images

### Option 2: Paste URL
**Pros:**
- ✅ Small database storage
- ✅ Uses CDN for fast delivery
- ✅ Can update image without changing URL

**Cons:**
- ❌ Requires external hosting
- ❌ Broken if URL changes
- ❌ Depends on external service

**Best for:** Large images, hosted on CDN

### Recommendation:
- **Logo/Favicon:** Upload from device (convenient)
- **Product images:** Use URLs from CDN (scalable)

---

## 🎊 Complete Features

Your platform now has:
1. ✅ Dynamic browser titles (all pages)
2. ✅ Dynamic favicon
3. ✅ Logo upload from device
4. ✅ Favicon upload from device
5. ✅ URL input for both
6. ✅ Live preview for both
7. ✅ Base64 encoding
8. ✅ MongoDB storage
9. ✅ Instant visibility across app

---

## 🚀 Deploy

```bash
git add frontend/
git commit -m "Add dynamic titles to all pages and file upload for logo/favicon"
git push origin main
```

Vercel will auto-deploy and you'll have:
- ✅ Custom browser titles everywhere
- ✅ Logo/favicon upload capability
- ✅ Complete white-label solution

---

## ✨ Summary

**Every browser tab now shows your custom store name!**
- Home: `YourStore - Your Tagline`
- Products: `Products - YourStore`
- Admin: `Dashboard - YourStore`
- All pages: Automatic!

**Plus:**
- Upload logo directly from computer
- Upload favicon directly from computer
- See live preview before saving
- Changes apply immediately after refresh

**One Platform → Infinite Branded Stores!** 🎉

