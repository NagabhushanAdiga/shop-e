# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
The `.env` file has been created with default values. Update if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop-e
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### 3. Install and Start MongoDB

**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
```bash
# Windows
net start MongoDB

# Mac (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Seed Database (Optional)
Populate with sample data:
```bash
node utils/seedData.js
```

This creates:
- Admin user: `admin@shop-e.com` / `admin123`
- Sample user: `john@example.com` / `password123`
- Sample categories and products

### 5. Start Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shop-e.com",
    "password": "admin123"
  }'
```

Save the token from response!

### 4. Get Products
```bash
curl http://localhost:5000/api/products
```

### 5. Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "CATEGORY_ID",
    "image": "image_url",
    "stock": 50
  }'
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User management
│   ├── productController.js # Product management
│   ├── categoryController.js # Category management
│   ├── orderController.js   # Order management
│   ├── feedbackController.js # Feedback management
│   └── reportController.js  # Reports and analytics
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling
│   └── upload.js          # File upload (Multer)
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Category.js        # Category schema
│   ├── Order.js           # Order schema
│   └── Feedback.js        # Feedback schema
├── routes/
│   ├── auth.js            # Auth routes
│   ├── users.js           # User routes
│   ├── products.js        # Product routes
│   ├── categories.js      # Category routes
│   ├── orders.js          # Order routes
│   ├── feedback.js        # Feedback routes
│   └── reports.js         # Report routes
├── utils/
│   ├── seedData.js        # Database seeding script
│   └── generateToken.js   # JWT token utility
├── uploads/               # Uploaded files directory
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── server.js             # Entry point
└── README.md             # Documentation
```

## Connecting Frontend to Backend

### Update Frontend API calls

Create an API utility file in your frontend:
```javascript
// frontend/src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Example Usage
```javascript
// Login
const response = await API.post('/auth/login', { email, password });
localStorage.setItem('token', response.data.token);

// Get products
const products = await API.get('/products');

// Create order
const order = await API.post('/orders', orderData);
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop other process using port 5000

### JWT Token Invalid
- Ensure token is included in Authorization header
- Token format: `Bearer <token>`
- Check if token is expired

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Use production MongoDB URI
- Configure proper CORS origins

### Security Checklist
- [ ] Change default JWT_SECRET
- [ ] Enable rate limiting
- [ ] Use HTTPS
- [ ] Set secure cookie flags
- [ ] Enable helmet security headers
- [ ] Validate all inputs
- [ ] Use environment variables for secrets

## Support

For issues or questions, check:
- MongoDB Documentation: https://docs.mongodb.com/
- Express Documentation: https://expressjs.com/
- Mongoose Documentation: https://mongoosejs.com/

