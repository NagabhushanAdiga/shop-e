// Mock feedback data
export const initialFeedback = [
  {
    id: 1,
    userId: 2,
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    subject: 'Great shopping experience!',
    message: 'I love the new interface! The checkout process is so smooth and easy to use. Keep up the great work!',
    rating: 5,
    status: 'pending', // pending, responded, resolved
    category: 'general',
    createdAt: '2024-11-09T10:30:00',
    response: null,
    respondedAt: null,
    respondedBy: null,
  },
  {
    id: 2,
    userId: 3,
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    subject: 'Product quality concern',
    message: 'The product I received was slightly different from what was shown in the pictures. Could you please clarify the specifications?',
    rating: 3,
    status: 'responded',
    category: 'product',
    createdAt: '2024-11-08T14:20:00',
    response: 'Thank you for your feedback. We apologize for any confusion. We have updated our product descriptions and images to be more accurate. Please contact support for a resolution.',
    respondedAt: '2024-11-09T09:15:00',
    respondedBy: 'Admin User',
  },
  {
    id: 3,
    userId: 4,
    userName: 'Mike Johnson',
    userEmail: 'mike.j@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    subject: 'Delivery was delayed',
    message: 'My order arrived 3 days late. I understand delays can happen, but I would appreciate better communication about shipping updates.',
    rating: 2,
    status: 'resolved',
    category: 'shipping',
    createdAt: '2024-11-07T16:45:00',
    response: 'We sincerely apologize for the delay. We have improved our shipping notification system and offered you a discount code for your next purchase.',
    respondedAt: '2024-11-08T10:00:00',
    respondedBy: 'Admin User',
  },
  {
    id: 4,
    userId: 5,
    userName: 'Sarah Wilson',
    userEmail: 'sarah.w@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    subject: 'Excellent customer service',
    message: 'I had an issue with my order and the support team was incredibly helpful and responsive. Thank you so much!',
    rating: 5,
    status: 'responded',
    category: 'support',
    createdAt: '2024-11-06T09:30:00',
    response: 'Thank you for your kind words! We are always here to help. Enjoy your purchase!',
    respondedAt: '2024-11-06T11:45:00',
    respondedBy: 'Admin User',
  },
  {
    id: 5,
    userId: 2,
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    subject: 'Feature request',
    message: 'It would be great if you could add a wishlist feature. That way I can save items I want to buy later!',
    rating: 4,
    status: 'pending',
    category: 'feature',
    createdAt: '2024-11-05T13:20:00',
    response: null,
    respondedAt: null,
    respondedBy: null,
  },
];

export const loadFeedback = () => {
  const savedFeedback = localStorage.getItem('feedback');
  return savedFeedback ? JSON.parse(savedFeedback) : initialFeedback;
};

export const saveFeedback = (feedback) => {
  localStorage.setItem('feedback', JSON.stringify(feedback));
};

export const feedbackCategories = ['general', 'product', 'shipping', 'support', 'feature', 'bug'];
export const feedbackStatuses = ['pending', 'responded', 'resolved'];

