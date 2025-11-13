// ⚠️ DEPRECATED: This static data is no longer used in the application
// The app now fetches data from the backend API at https://shop-e-server.vercel.app/api
// This file is kept for reference only

// Mock orders data
export const initialOrders = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    userId: 2,
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8900',
    },
    items: [
      { productId: 1, name: 'Wireless Headphones', quantity: 1, price: 79.99 },
      { productId: 4, name: 'Bluetooth Speaker', quantity: 2, price: 59.99 },
    ],
    subtotal: 199.97,
    shipping: 5.99,
    tax: 16.00,
    total: 221.96,
    status: 'pending',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    transactionId: 'UPI-1731067800123',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2024-11-08T10:30:00',
    updatedAt: '2024-11-08T10:30:00',
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    userId: 3,
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234-567-8901',
    },
    items: [
      { productId: 2, name: 'Smart Watch', quantity: 1, price: 199.99 },
    ],
    subtotal: 199.99,
    shipping: 0,
    tax: 16.00,
    total: 215.99,
    status: 'processing',
    paymentMethod: 'PhonePe',
    paymentStatus: 'paid',
    transactionId: 'PP-1731067900456',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    createdAt: '2024-11-08T11:15:00',
    updatedAt: '2024-11-08T12:00:00',
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+1 234-567-8902',
    },
    items: [
      { productId: 5, name: 'Running Shoes', quantity: 1, price: 89.99 },
      { productId: 7, name: 'Yoga Mat', quantity: 1, price: 29.99 },
    ],
    subtotal: 119.98,
    shipping: 0,
    tax: 9.60,
    total: 129.58,
    status: 'shipped',
    paymentMethod: 'Google Pay',
    paymentStatus: 'paid',
    transactionId: 'GP-1731068000789',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    createdAt: '2024-11-07T14:20:00',
    updatedAt: '2024-11-08T09:00:00',
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      phone: '+1 234-567-8903',
    },
    items: [
      { productId: 6, name: 'Coffee Maker', quantity: 1, price: 129.99 },
    ],
    subtotal: 129.99,
    shipping: 0,
    tax: 10.40,
    total: 140.39,
    status: 'delivered',
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    transactionId: 'CARD-1731068100234',
    shippingAddress: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    createdAt: '2024-11-06T09:30:00',
    updatedAt: '2024-11-07T16:45:00',
  },
  {
    id: 5,
    orderNumber: 'ORD-2024-005',
    customer: {
      name: 'David Brown',
      email: 'david.b@example.com',
      phone: '+1 234-567-8904',
    },
    items: [
      { productId: 9, name: 'Sunglasses', quantity: 2, price: 69.99 },
    ],
    subtotal: 139.98,
    shipping: 0,
    tax: 11.20,
    total: 151.18,
    status: 'cancelled',
    paymentMethod: 'UPI',
    paymentStatus: 'refunded',
    transactionId: 'UPI-1731068300890',
    shippingAddress: {
      street: '555 Maple Dr',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    createdAt: '2024-11-05T15:00:00',
    updatedAt: '2024-11-06T10:30:00',
  },
];

export const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders');
  return savedOrders ? JSON.parse(savedOrders) : initialOrders;
};

export const saveOrders = (orders) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

export const paymentStatuses = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'refunded', label: 'Refunded', color: 'error' },
  { value: 'failed', label: 'Failed', color: 'error' },
];

