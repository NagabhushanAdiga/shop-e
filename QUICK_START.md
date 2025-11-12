# 🚀 Quick Start Guide - Shop-E

## Current Status: ✅ READY TO USE

Your Shop-E application has two modes of operation:

### Mode 1: LocalStorage (DEFAULT - Currently Active)
Everything works right now without any setup!

### Mode 2: Full Backend API (Optional - When Ready)
Enable when you want database persistence and production features.

---

## 🎮 Run the Application (LocalStorage Mode)

### Step 1: Start Frontend
```bash
cd frontend
npm start
```

That's it! Open `http://localhost:3000` 🎉

### What Works Right Now:
- ✅ Browse products
- ✅ Add to cart
- ✅ Checkout with payment options
- ✅ User registration & login (mock)
- ✅ Admin panel (login: any email with 'admin')
- ✅ Product management
- ✅ Order management
- ✅ User management
- ✅ Reports & analytics
- ✅ Feedback system
- ✅ Dark/Light mode
- ✅ Responsive design

---

## 🔌 Enable Backend API (Optional)

Want real database, authentication, and multi-user support?

### Prerequisites:
- MongoDB installed locally OR MongoDB Atlas account
- Node.js v14+

### Step 1: Start MongoDB (Local)
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

OR use MongoDB Atlas (free cloud database)

### Step 2: Backend Setup
```bash
# Terminal 1
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop-e
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Seed the database (first time only):
```bash
node utils/seedData.js
```

Start backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### Step 3: Enable API in Frontend

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_USE_API=true
```

Restart frontend:
```bash
# Terminal 2
cd frontend
npm start
```

### Step 4: Test It!

Login with test accounts:
- **Admin**: admin@shop-e.com / admin123
- **User**: john@example.com / password123

---

## 🎯 Quick Commands

### Run Frontend Only (LocalStorage Mode)
```bash
cd frontend && npm start
```

### Run Full Stack (API Mode)
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

### Reset Data
```bash
# Backend mode
cd backend && node utils/seedData.js

# LocalStorage mode
# Clear browser localStorage in DevTools
```

---

## 📁 Project Structure

```
shop-e/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React contexts
│   │   ├── data/             # Mock data
│   │   └── utils/            # Helper functions
│   └── public/
├── backend/                  # Express API
│   ├── models/               # MongoDB models
│   ├── controllers/          # Route controllers
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   └── utils/                # Helper utilities
└── docs/                     # Documentation
```

---

## 🔑 Default Test Accounts (Backend Mode)

After running seed script:

**Admin:**
- Email: admin@shop-e.com
- Password: admin123
- Access: Full admin panel

**Regular User:**
- Email: john@example.com
- Password: password123
- Access: Shopping & profile

---

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

---

## 📖 Documentation

- `BACKEND_INTEGRATION_COMPLETE.md` - Complete integration guide
- `backend/README.md` - API documentation
- `backend/SETUP.md` - Backend setup details
- `frontend/BACKEND_INTEGRATION_INSTRUCTIONS.md` - Frontend integration
- `frontend/PAYMENT_GATEWAY_GUIDE.md` - Payment setup

---

## 🆘 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend won't connect to MongoDB
- Check MongoDB is running: `mongosh` (should connect)
- Check MONGODB_URI in backend/.env
- Try: `mongodb://127.0.0.1:27017/shop-e`

### Can't login (Backend mode)
- Run seed script: `cd backend && node utils/seedData.js`
- Check backend console for errors
- Try test accounts above

### CORS errors
- Check FRONTEND_URL in backend/.env
- Should be: `http://localhost:3000`

### Port already in use
```bash
# Change port in backend/.env
PORT=5001

# Or kill process on port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## ✨ Features

### User Features:
- 🛍️ Browse products with filters
- 🛒 Shopping cart
- 💳 Multiple payment options (UPI, PhonePe, Google Pay, Card, COD)
- 👤 User profile & order history
- 📦 Order tracking
- ⭐ Product ratings
- 💬 Feedback system
- 🌓 Dark/Light theme

### Admin Features:
- 📊 Dashboard with analytics
- 📦 Product management (CRUD)
- 📋 Order management
- 👥 User management
- 📁 Category management
- 💬 Feedback management
- 📈 Reports & statistics
- 💳 Payment tracking

---

## 🎓 Learning Resources

### Frontend Stack:
- React 18
- Material-UI (MUI)
- Framer Motion
- React Router v6

### Backend Stack:
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcrypt for passwords

---

## 🚀 You're Ready!

**Current Mode**: LocalStorage ✅
- Just run `cd frontend && npm start`
- Everything works out of the box!

**Want Backend?**
- Follow "Enable Backend API" section above
- Get database persistence and production features

**Need Help?**
- Check documentation files
- Read troubleshooting section
- Check console for errors

Happy coding! 🎉

