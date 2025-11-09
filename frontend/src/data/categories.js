// Mock categories data
export const initialCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    active: true,
    productCount: 5,
    createdAt: '2024-01-01T00:00:00',
  },
  {
    id: 2,
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    active: true,
    productCount: 2,
    createdAt: '2024-01-01T00:00:00',
  },
  {
    id: 3,
    name: 'Home',
    description: 'Home appliances and decor',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
    active: true,
    productCount: 2,
    createdAt: '2024-01-01T00:00:00',
  },
  {
    id: 4,
    name: 'Sports',
    description: 'Sports equipment and fitness gear',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
    active: true,
    productCount: 2,
    createdAt: '2024-01-01T00:00:00',
  },
  {
    id: 5,
    name: 'Accessories',
    description: 'Various accessories and small items',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80',
    active: true,
    productCount: 1,
    createdAt: '2024-01-01T00:00:00',
  },
];

export const loadCategories = () => {
  const savedCategories = localStorage.getItem('categories');
  return savedCategories ? JSON.parse(savedCategories) : initialCategories;
};

export const saveCategories = (categories) => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

