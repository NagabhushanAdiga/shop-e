// Mock users data
export const initialUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@shop-e.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1 234-567-8900',
    status: 'active',
    createdAt: '2024-01-01T00:00:00',
    lastLogin: '2024-11-09T10:30:00',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
    phone: '+1 234-567-8900',
    status: 'active',
    createdAt: '2024-02-15T00:00:00',
    lastLogin: '2024-11-08T14:20:00',
    totalOrders: 5,
    totalSpent: 847.50,
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=5',
    phone: '+1 234-567-8901',
    status: 'active',
    createdAt: '2024-03-10T00:00:00',
    lastLogin: '2024-11-08T11:15:00',
    totalOrders: 8,
    totalSpent: 1245.99,
  },
  {
    id: 4,
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=3',
    phone: '+1 234-567-8902',
    status: 'active',
    createdAt: '2024-04-05T00:00:00',
    lastLogin: '2024-11-07T16:45:00',
    totalOrders: 3,
    totalSpent: 456.78,
  },
  {
    id: 5,
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=9',
    phone: '+1 234-567-8903',
    status: 'active',
    createdAt: '2024-05-20T00:00:00',
    lastLogin: '2024-11-06T09:30:00',
    totalOrders: 12,
    totalSpent: 2345.60,
  },
  {
    id: 6,
    name: 'David Brown',
    email: 'david.b@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=4',
    phone: '+1 234-567-8904',
    status: 'inactive',
    createdAt: '2024-06-15T00:00:00',
    lastLogin: '2024-10-20T12:00:00',
    totalOrders: 1,
    totalSpent: 89.99,
  },
];

export const loadUsers = () => {
  const savedUsers = localStorage.getItem('users');
  return savedUsers ? JSON.parse(savedUsers) : initialUsers;
};

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const userRoles = ['admin', 'user', 'moderator'];
export const userStatuses = ['active', 'inactive', 'suspended'];

