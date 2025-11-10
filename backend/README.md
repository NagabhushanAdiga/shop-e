# Shop-E Backend API

Complete REST API for the Shop-E E-commerce application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Complete CRUD operations for users
- **Product Management** - Products with categories, images, and inventory
- **Order Management** - Full order lifecycle with status tracking
- **Category Management** - Organize products into categories
- **Feedback System** - Customer feedback with admin responses
- **Reports & Analytics** - Dashboard stats and detailed reports
- **Security** - Helmet, rate limiting, CORS, and password hashing
- **File Upload** - Support for product images (using Multer)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and update the values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop-e
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

4. **Start the server:**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/logout` - Logout user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (admin creation)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Feedback
- `GET /api/feedback` - Get all feedback (Admin)
- `GET /api/feedback/:id` - Get single feedback
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback/:id/respond` - Respond to feedback (Admin)
- `PUT /api/feedback/:id/status` - Update feedback status (Admin)
- `DELETE /api/feedback/:id` - Delete feedback (Admin)

### Reports (Admin only)
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/customers` - Customer report
- `GET /api/reports/products` - Product report

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 📦 Models

### User
- name, email, password, role, phone, avatar, status
- totalOrders, totalSpent, lastLogin
- timestamps

### Product
- name, description, price, category, image
- stock, rating, numReviews, featured
- timestamps

### Category
- name, slug, description, image, active
- productCount, timestamps

### Order
- orderNumber, user, customer info, items
- subtotal, tax, shippingFee, total
- paymentMethod, paymentStatus, status
- trackingNumber, timestamps

### Feedback
- user, subject, message, rating, category
- status, response, respondedBy, respondedAt
- timestamps

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shop-e
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

## 🚦 Error Handling

The API uses a centralized error handler that returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## 📝 Response Format

Success responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT authentication
- Helmet for security headers
- Rate limiting
- CORS configuration
- Input validation
- MongoDB injection prevention

## 📊 Sample Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Create Product
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "description": "Premium quality headphones",
  "price": 79.99,
  "category": "category_id",
  "image": "image_url",
  "stock": 50,
  "featured": true
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 79.99,
      "image": "image_url"
    }
  ],
  "subtotal": 159.98,
  "tax": 12.80,
  "shippingFee": 10.00,
  "total": 182.78,
  "paymentMethod": "credit_card"
}
```

## 🧪 Testing

Use tools like Postman, Insomnia, or Thunder Client to test the API endpoints.

## 📄 License

ISC

## 👨‍💻 Author

Shop-E Development Team

