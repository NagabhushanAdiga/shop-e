# 🚀 Quick Start Guide - Shop-E

## Installation & Run

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the app
npm start

# 4. Open browser
http://localhost:3000
```

---

## 🔐 Login Credentials

### Admin Account
```
Email: admin@shop-e.com
Password: admin123
```
**Access:** Admin Dashboard + All Features

### User Account
```
Email: Any email (e.g., user@test.com)
Password: Any password
```
**Access:** Shopping Features Only

---

## 🎯 What You Can Do

### 👤 As a User:
1. **Browse Products** - 12 products across 5 categories
2. **Search & Filter** - Find what you need quickly
3. **Add to Cart** - Smart cart with quantity management
4. **Checkout** - Complete order flow with validation
5. **View Cart Dialog** - Quick preview from header

### 👨‍💼 As an Admin:
1. **Dashboard Stats** - View inventory metrics
2. **Add Products** - Create new products via dialog
3. **Edit Products** - Update any product details
4. **Delete Products** - Remove items with confirmation
5. **Manage Stock** - Track and update inventory
6. **Feature Products** - Toggle featured status

---

## 📱 Key Features

✅ **Fully Responsive** - Works on mobile, tablet, desktop  
✅ **MUI Dialogs** - Beautiful modal interactions  
✅ **Animations** - Smooth Framer Motion effects  
✅ **Role-Based Access** - Admin vs User permissions  
✅ **Static Data** - 12 pre-loaded products  
✅ **LocalStorage** - Cart & auth persistence  
✅ **Form Validation** - All forms have validation  

---

## 📄 Available Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured products |
| `/products` | All products with filters |
| `/products/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/login` | Login page |
| `/signup` | Registration page |
| `/admin` | Admin dashboard (admin only) |

---

## 🎨 Technology Stack

- React 18
- Material-UI (MUI)
- Framer Motion
- React Router
- Context API

---

## 📦 Project Structure

```
frontend/src/
├── App.jsx                    # Main app
├── components/                # UI components
├── context/                   # State management
├── pages/                     # Application pages
├── data/                      # Static product data
└── public/                    # Static assets
```

---

## 🔄 Quick Test Flow

1. **Homepage** → See featured products
2. **Products** → Filter by "Electronics"
3. **Product Detail** → Add item to cart
4. **Cart Dialog** → Opens automatically
5. **Cart Page** → Adjust quantities
6. **Checkout** → Fill form & place order
7. **Login as Admin** → admin@shop-e.com / admin123
8. **Admin Dashboard** → Add/Edit/Delete products

---

## 💡 Tips

- **Cart persists** - Refresh page, cart stays!
- **Admin changes save** - Product edits are stored
- **Mobile friendly** - Try it on your phone
- **Animations** - Hover over cards for effects
- **Dialogs everywhere** - MUI dialogs for better UX

---

## 📚 Documentation

- **README.md** - Installation guide
- **PROJECT_GUIDE.md** - Complete feature documentation
- **QUICKSTART.md** - This file

---

## 🎉 You're Ready!

Start exploring the app and enjoy the full e-commerce experience!

**Need help?** Check PROJECT_GUIDE.md for detailed documentation.

