# 🛍️ Shop-E - Modern E-Commerce Platform

<div align="center">

![Shop-E Logo](https://img.shields.io/badge/Shop--E-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![MUI](https://img.shields.io/badge/MUI-5.14-007FFF?style=for-the-badge&logo=mui)

A full-stack e-commerce platform with modern UI, payment gateway integration, and comprehensive admin panel.

[Quick Start](#-quick-start) •
[Features](#-features) •
[Documentation](#-documentation) •
[Tech Stack](#-tech-stack)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Shop-E is a modern, full-featured e-commerce platform built with React and Node.js. It features a beautiful Material-UI interface, complete admin panel, multiple payment options, and both localStorage and database modes.

### Key Highlights:

✨ **Dual Operation Modes**
- LocalStorage mode (no backend needed)
- Full API mode (production-ready backend)

🎨 **Modern UI/UX**
- Material-UI components
- Framer Motion animations
- Dark/Light theme support
- Fully responsive design

💳 **Payment Integration**
- UPI
- PhonePe
- Google Pay
- Card payments
- Cash on Delivery

🔐 **Security**
- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Protected routes

📊 **Admin Panel**
- Product management
- Order management
- User management
- Analytics & reports
- Feedback system

---

## ✨ Features

### 🛒 Customer Features

- **Product Browsing**
  - Grid/List view
  - Category filtering
  - Search functionality
  - Product details with images
  - Related products

- **Shopping Cart**
  - Add/Remove items
  - Quantity management
  - Real-time total calculation
  - Persistent cart state

- **Checkout Process**
  - Multi-step checkout
  - Address management
  - Multiple payment options
  - Order confirmation

- **User Account**
  - Registration & Login
  - Profile management
  - Order history
  - Order tracking

- **Additional Features**
  - Product ratings & reviews
  - Wishlist
  - Feedback system
  - Dark/Light mode toggle

### 👨‍💼 Admin Features

- **Dashboard**
  - Sales analytics
  - Order statistics
  - Revenue tracking
  - Payment method breakdown
  - Quick actions

- **Product Management**
  - CRUD operations
  - Image upload
  - Category management
  - Stock tracking
  - Featured products

- **Order Management**
  - Order listing with filters
  - Status updates
  - Order details view
  - Payment tracking
  - Transaction IDs

- **User Management**
  - User listing
  - Create/Edit users
  - Role assignment
  - Status management
  - User activity tracking

- **Reports & Analytics**
  - Sales reports
  - Customer analytics
  - Product performance
  - Payment statistics
  - Exportable reports

- **Feedback Management**
  - View customer feedback
  - Respond to feedback
  - Status tracking
  - Resolution history

---

## 🚀 Quick Start

### Prerequisites

- Node.js v14+ installed
- MongoDB (optional - for backend mode)
- npm or yarn

### Option 1: LocalStorage Mode (Fastest)

Perfect for demos, development, and testing!

```bash
# Clone the repository
git clone <your-repo-url>
cd shop-e

# Install frontend dependencies
cd frontend
npm install

# Start the application
npm start
```

Open `http://localhost:3000` 🎉

**That's it!** The app runs entirely in the browser with localStorage.

### Option 2: Full Stack Mode (Production)

For production use with database persistence.

#### Step 1: Backend Setup

```bash
# Install backend dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and secrets
# Then seed the database
node utils/seedData.js

# Start backend server
npm run dev
```

Backend runs at `http://localhost:5000`

#### Step 2: Frontend Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_USE_API=true" >> .env

# Start frontend
npm start
```

Frontend runs at `http://localhost:3000`

#### Step 3: Login

Use test accounts:
- **Admin**: admin@shop-e.com / admin123
- **User**: john@example.com / password123

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Material-UI (MUI)** | Component library |
| **React Router v6** | Routing |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |
| **Context API** | State management |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File uploads |
| **Helmet** | Security headers |

### Additional Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **dotenv** - Environment variables
- **Morgan** - HTTP logging
- **CORS** - Cross-origin support

---

## 📁 Project Structure

```
shop-e/
│
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── PaymentMethods.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── Feedback.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── Settings.jsx
│   │   ├── services/            # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── userService.js
│   │   │   ├── categoryService.js
│   │   │   ├── feedbackService.js
│   │   │   ├── reportService.js
│   │   │   └── paymentService.js
│   │   ├── context/             # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── layouts/             # Layout components
│   │   │   └── AdminLayout.jsx
│   │   ├── data/                # Mock data
│   │   ├── utils/               # Utilities
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # Configuration
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
├── backend/                     # Express API
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   └── Feedback.js
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── categoryController.js
│   │   ├── feedbackController.js
│   │   ├── reportController.js
│   │   └── paymentController.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── categories.js
│   │   ├── feedback.js
│   │   ├── reports.js
│   │   └── payments.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── utils/                  # Utilities
│   │   ├── generateToken.js
│   │   └── seedData.js
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env
│
├── docs/                       # Documentation
│   ├── BACKEND_INTEGRATION_COMPLETE.md
│   ├── QUICK_START.md
│   └── API.md
│
└── README.md                   # This file
```

---

## 📚 Documentation

Comprehensive documentation is available:

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide for both modes
- **[BACKEND_INTEGRATION_COMPLETE.md](BACKEND_INTEGRATION_COMPLETE.md)** - Complete integration guide

### Backend
- **[backend/README.md](backend/README.md)** - API documentation
- **[backend/SETUP.md](backend/SETUP.md)** - Backend setup guide
- **[backend/FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** - Integration details

### Frontend
- **[frontend/BACKEND_INTEGRATION_INSTRUCTIONS.md](frontend/BACKEND_INTEGRATION_INSTRUCTIONS.md)** - Frontend integration
- **[frontend/PAYMENT_GATEWAY_GUIDE.md](frontend/PAYMENT_GATEWAY_GUIDE.md)** - Payment setup
- **[frontend/ENV_SETUP.md](frontend/ENV_SETUP.md)** - Environment configuration

---

## 🖼️ Screenshots

### User Interface
- **Home Page**: Modern hero section, featured products, categories
- **Products Page**: Grid view with filters and search
- **Product Detail**: Image gallery, specifications, add to cart
- **Cart**: Item management, totals, checkout button
- **Checkout**: Multi-step with payment options

### Admin Panel
- **Dashboard**: Analytics, charts, quick stats
- **Products**: CRUD operations, image upload
- **Orders**: List view, status management, details
- **Users**: User management, role assignment
- **Reports**: Analytics and statistics

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
cd frontend
npm run build

# Deploy dist/build folder to:
# - Vercel: vercel deploy
# - Netlify: netlify deploy --prod
```

**Environment Variables:**
```env
REACT_APP_API_URL=https://your-api.com/api
REACT_APP_USE_API=true
```

### Backend Deployment (Heroku/Railway/DigitalOcean)

```bash
# Set environment variables
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main
```

### Database (MongoDB Atlas)

1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI`
4. Run seed script on server

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- Material-UI for the beautiful component library
- Framer Motion for smooth animations
- MongoDB for the database
- Express.js for the robust backend framework

---

## 📞 Support

For support, email support@shop-e.com or create an issue in the repository.

---

## 🌟 Show Your Support

Give a ⭐️ if you like this project!

---

<div align="center">

**Built with ❤️ by the Shop-E Team**

[Website](https://shop-e.com) • [Documentation](./docs) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

