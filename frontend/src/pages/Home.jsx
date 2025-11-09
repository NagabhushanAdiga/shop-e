import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowForward,
  LocalShipping,
  Security,
  Support,
  CardGiftcard,
  TrendingUp,
  Star,
  Laptop,
  Watch,
  Checkroom,
  FitnessCenter,
  Home as HomeIcon,
  NavigateNext,
  NavigateBefore,
  Favorite,
  Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadProducts } from '../data/products';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const featuredProducts = products.filter((p) => p.featured);
  const bestSellers = products.slice(0, 8);
  const newArrivals = products.slice(8, 12);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const categories = [
    { name: 'Electronics', icon: <Laptop />, color: '#667eea', count: products.filter(p => p.category === 'Electronics').length, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
    { name: 'Fashion', icon: <Checkroom />, color: '#f093fb', count: products.filter(p => p.category === 'Fashion').length, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
    { name: 'Sports', icon: <FitnessCenter />, color: '#4facfe', count: products.filter(p => p.category === 'Sports').length, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
    { name: 'Home', icon: <HomeIcon />, color: '#43e97b', count: products.filter(p => p.category === 'Home').length, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80' },
  ];

  const heroSlides = [
    {
      title: 'Summer Collection 2024',
      subtitle: 'Get Up to 50% Off',
      description: 'Shop the hottest trends of the season',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
      cta: 'Shop Now',
    },
    {
      title: 'New Electronics Arrival',
      subtitle: 'Latest Tech at Best Prices',
      description: 'Upgrade your gadgets today',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
      cta: 'Explore Now',
    },
    {
      title: 'Fitness Revolution',
      subtitle: 'Premium Sports Equipment',
      description: 'Achieve your fitness goals',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
      cta: 'Get Started',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Full-Width Hero Carousel */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          overflow: 'hidden',
          bgcolor: 'black',
        }}
      >
        {heroSlides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: activeSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            {/* Background Image */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.6)',
              }}
            />

            {/* Content Overlay */}
            <Container
              maxWidth="xl"
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 50 }}
                transition={{ duration: 0.8 }}
                sx={{ maxWidth: { xs: '100%', md: '50%' } }}
              >
                <Chip
                  label="🔥 Hot Deal"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    mb: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                />
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant={isMobile ? 'h5' : 'h3'}
                  sx={{
                    color: 'warning.light',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 4,
                    opacity: 0.95,
                  }}
                >
                  {slide.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)',
                      },
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    {slide.cta}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </MotionBox>
            </Container>
          </Box>
        ))}

        {/* Navigation Arrows */}
        <IconButton
          onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
            zIndex: 2,
          }}
        >
          <NavigateBefore />
        </IconButton>
        <IconButton
          onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
            zIndex: 2,
          }}
        >
          <NavigateNext />
        </IconButton>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveSlide(index)}
              sx={{
                width: activeSlide === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: activeSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Features Bar - Full Width */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {[
              { icon: <LocalShipping />, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: <Security />, title: 'Secure Payment', desc: '100% protected' },
              { icon: <Support />, title: '24/7 Support', desc: 'Dedicated support' },
              { icon: <CardGiftcard />, title: 'Gift Cards', desc: 'Buy now, use later' },
            ].map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Shop by Category - Full Width Background */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" fontWeight={700} sx={{ fontSize: '1rem' }}>
              EXPLORE
            </Typography>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              Shop by Category
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Discover our curated collections
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/products')}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    height: { xs: 200, md: 300 },
                  }}
                >
                  {/* Background Image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(0.7)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        filter: 'brightness(0.5)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  />

                  {/* Content Overlay */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 3,
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        color: category.color,
                        mb: 2,
                        width: 'fit-content',
                      }}
                    >
                      {React.cloneElement(category.icon, { sx: { fontSize: 28 } })}
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="white" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                      {category.count} Products
                    </Typography>
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Best Sellers - Full Width */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Star sx={{ color: 'warning.main', fontSize: 28 }} />
                <Typography variant="overline" color="primary" fontWeight={700} sx={{ fontSize: '1rem' }}>
                  TRENDING
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800}>
                Best Sellers
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForward />}
              size="large"
              sx={{ display: { xs: 'none', md: 'flex' }, fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {bestSellers.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    {/* Overlay Icons */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                          boxShadow: 2,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Favorite fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' },
                          boxShadow: 2,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>

                    {product.featured && (
                      <Chip
                        icon={<TrendingUp />}
                        label="Hot"
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 0.5, minHeight: 50 }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip label="In Stock" size="small" color="success" variant="outlined" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        py: 1.2,
                        fontWeight: 600,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5, display: { md: 'none' } }}>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ px: 4, fontWeight: 600 }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Full-Width Promotional Banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: '60vh' },
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: { md: 'absolute' },
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />

        {/* Content */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            py: { xs: 8, md: 0 },
          }}
        >
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{ maxWidth: { xs: '100%', md: '50%' } }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '3.5rem' },
              }}
            >
              Weekend Special Sale!
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'warning.light',
                fontWeight: 700,
                mb: 2,
              }}
            >
              Up to 50% OFF
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                mb: 4,
                opacity: 0.95,
              }}
            >
              Limited time offer on selected items. Don't miss out on amazing deals!
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: 'error.main',
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                },
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              Shop Sale
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Testimonials/Trust Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" fontWeight={700} sx={{ fontSize: '1rem' }}>
              TRUSTED BY THOUSANDS
            </Typography>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              Why Choose Shop-E?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Join our growing community of satisfied customers
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: '⭐',
                title: '10,000+',
                subtitle: 'Happy Customers',
                desc: 'Trusted worldwide',
              },
              {
                icon: '📦',
                title: '50,000+',
                subtitle: 'Products Delivered',
                desc: 'Fast shipping',
              },
              {
                icon: '🏆',
                title: '4.9/5',
                subtitle: 'Customer Rating',
                desc: 'Excellent service',
              },
              {
                icon: '🎁',
                title: '24/7',
                subtitle: 'Customer Support',
                desc: 'Always here for you',
              },
            ].map((item, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter - Full Width */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              Stay in the Loop!
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.95 }}>
              Subscribe for exclusive deals, new arrivals, and special offers
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 600,
                mx: 'auto',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box
                component="input"
                placeholder="Enter your email address"
                sx={{
                  flex: 1,
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  border: 'none',
                  fontSize: '1.1rem',
                  '&:focus': { outline: 'none' },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  px: 5,
                  py: 2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
              *Get 10% off your first order when you subscribe
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
