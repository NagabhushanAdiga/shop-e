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
  alpha,
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
  FlashOn,
  NewReleases,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/currency';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productService.getAll();
        if (result.success && result.data) {
          setProducts(result.data.products || result.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      subtitle: 'Up to 50% Off',
      description: 'Shop the hottest trends of the season',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
      badge: '🔥 Hot Deal',
    },
    {
      title: 'New Electronics Arrival',
      subtitle: 'Latest Tech at Best Prices',
      description: 'Upgrade your gadgets today',
      image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=1600&q=80',
      badge: '⚡ New',
    },
    {
      title: 'Fitness Revolution',
      subtitle: 'Premium Sports Equipment',
      description: 'Achieve your fitness goals',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
      badge: '💪 Trending',
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
      {/* Full-Screen Hero Carousel with Enhanced Design */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '85vh' },
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
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            {/* Background Image with Parallax Effect */}
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
                transform: activeSlide === index ? 'scale(1)' : 'scale(1.1)',
                transition: 'transform 5s ease-out',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                },
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
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: activeSlide === index ? 1 : 0, x: activeSlide === index ? 0 : -100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                sx={{ maxWidth: { xs: '100%', md: '55%' } }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeSlide === index ? 1 : 0, y: activeSlide === index ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Chip
                    label={slide.badge}
                    sx={{
                      bgcolor: 'error.main',
                      color: 'white',
                      mb: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 2,
                      py: 2.5,
                      boxShadow: '0 4px 14px rgba(244, 67, 54, 0.4)',
                    }}
                  />
                </motion.div>
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    mb: 2,
                    lineHeight: 1.1,
                    textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant={isMobile ? 'h5' : 'h3'}
                  sx={{
                    color: 'warning.light',
                    fontWeight: 800,
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
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
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                    fontSize: { xs: '1rem', md: '1.3rem' },
                  }}
                >
                  {slide.description}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    View Deals
                  </Button>
                </Stack>
              </MotionBox>
            </Container>
          </Box>
        ))}

        {/* Enhanced Navigation Arrows */}
        <IconButton
          onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          sx={{
            position: 'absolute',
            left: { xs: 10, md: 30 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            width: { xs: 40, md: 56 },
            height: { xs: 40, md: 56 },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            zIndex: 2,
            transition: 'all 0.3s',
          }}
        >
          <NavigateBefore sx={{ fontSize: { xs: 28, md: 36 } }} />
        </IconButton>
        <IconButton
          onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
          sx={{
            position: 'absolute',
            right: { xs: 10, md: 30 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            width: { xs: 40, md: 56 },
            height: { xs: 40, md: 56 },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            zIndex: 2,
            transition: 'all 0.3s',
          }}
        >
          <NavigateNext sx={{ fontSize: { xs: 28, md: 36 } }} />
        </IconButton>

        {/* Enhanced Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 2,
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveSlide(index)}
              sx={{
                width: activeSlide === index ? 50 : 14,
                height: 14,
                borderRadius: 7,
                bgcolor: activeSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeSlide === index ? '0 0 20px rgba(255,255,255,0.5)' : 'none',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Enhanced Features Bar with Icons */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
          <Grid container spacing={3}>
            {[
              { icon: <LocalShipping />, title: 'Free Shipping', desc: 'On orders over $50', color: '#667eea' },
              { icon: <Security />, title: 'Secure Payment', desc: '100% protected', color: '#43e97b' },
              { icon: <Support />, title: '24/7 Support', desc: 'Dedicated support', color: '#f093fb' },
              { icon: <CardGiftcard />, title: 'Gift Cards', desc: 'Buy now, use later', color: '#ffa502' },
            ].map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2.5,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                      border: `2px solid ${feature.color}30`,
                      color: feature.color,
                      mb: 2,
                      transition: 'all 0.3s',
                    }}
                  >
                    {React.cloneElement(feature.icon, { sx: { fontSize: 36 } })}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
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

      {/* Enhanced Shop by Category */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Chip
                label="EXPLORE"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  px: 2,
                }}
              />
              <Typography variant="h2" fontWeight={900} gutterBottom sx={{ mb: 2 }}>
                Shop by Category
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Discover our curated collections across different categories
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -20,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                  }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/products')}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    height: { xs: 250, md: 350 },
                    border: '1px solid',
                    borderColor: 'divider',
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
                      transition: 'all 0.5s',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, ${category.color}dd, transparent)`,
                      },
                      '&:hover': {
                        transform: 'scale(1.1)',
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
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        color: category.color,
                        mb: 2,
                        width: 'fit-content',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      }}
                    >
                      {React.cloneElement(category.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography variant="h4" fontWeight={800} color="white" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body1" color="white" sx={{ opacity: 0.95, fontWeight: 500 }}>
                      {category.count} Products
                    </Typography>
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Flash Deals Section */}
      <Box sx={{ bgcolor: 'error.main', color: 'white', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FlashOn sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>
              FLASH SALE - Limited Time Only!
            </Typography>
            <Chip
              label="Ends in 23:59:45"
              sx={{
                bgcolor: 'white',
                color: 'error.main',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Enhanced Best Sellers */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Star sx={{ color: 'warning.main', fontSize: 32 }} />
                <Chip
                  label="TRENDING"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="h2" fontWeight={900} gutterBottom>
                Best Sellers
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Shop our most popular products
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForward />}
              size="large"
              variant="contained"
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
              }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {bestSellers.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -20,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    />
                    
                    {/* Overlay Icons with Animation */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        '.MuiCard-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          boxShadow: 3,
                          '&:hover': {
                            bgcolor: 'error.main',
                            color: 'white',
                            transform: 'scale(1.15)',
                          },
                          transition: 'all 0.3s',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Favorite fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          boxShadow: 3,
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            transform: 'scale(1.15)',
                          },
                          transition: 'all 0.3s',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>

                    {product.featured && (
                      <Chip
                        icon={<TrendingUp />}
                        label="HOT"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 15,
                          left: 15,
                          bgcolor: 'error.main',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: '0 4px 14px rgba(244, 67, 54, 0.4)',
                        }}
                      />
                    )}

                    {/* Discount Badge */}
                    <Chip
                      label="-20%"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 15,
                        left: 15,
                        bgcolor: 'warning.main',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: 2,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      {product.category}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1, minHeight: 50 }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                      <Typography variant="h5" color="primary" fontWeight={800}>
                        {formatCurrency(product.price)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'text.secondary',
                        }}
                      >
                        {formatCurrency(product.price * 1.2)}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<Verified />}
                      label="In Stock"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
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
                        py: 1.3,
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6, display: { md: 'none' } }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 5,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* New Arrivals Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<NewReleases />}
              label="JUST IN"
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                fontWeight: 700,
                mb: 2,
              }}
            />
            <Typography variant="h2" fontWeight={900} gutterBottom>
              New Arrivals
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Check out our latest products
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {newArrivals.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <MotionCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'secondary.light',
                    position: 'relative',
                  }}
                >
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'secondary.main',
                      color: 'white',
                      fontWeight: 700,
                      zIndex: 1,
                    }}
                  />
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      {product.name}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={700} sx={{ mt: 1 }}>
                      {formatCurrency(product.price)}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Promotional Banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'auto', md: '65vh' },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: { md: 'absolute' },
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: { md: 'fixed' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
            },
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            py: { xs: 10, md: 0 },
          }}
        >
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={7}>
              <MotionBox
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="⚡ LIMITED TIME OFFER"
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Weekend Special Sale!
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 4,
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
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
                    px: 6,
                    py: 2.5,
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Shop Sale
                </Button>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={5}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                sx={{ textAlign: 'center' }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 200, md: 300 },
                    height: { xs: 200, md: 300 },
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(20px)',
                    border: '4px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        color: 'white',
                        fontWeight: 900,
                        fontSize: { xs: '4rem', md: '6rem' },
                        lineHeight: 1,
                      }}
                    >
                      50%
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                      }}
                    >
                      OFF
                    </Typography>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Trust Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          py: { xs: 10, md: 14 },
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="WHY SHOP-E?"
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 700,
                mb: 2,
              }}
            />
            <Typography variant="h2" fontWeight={900} gutterBottom>
              Trusted by Thousands
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Join our growing community of satisfied customers worldwide
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: '⭐',
                title: '10,000+',
                subtitle: 'Happy Customers',
                desc: 'Trusted worldwide',
                color: '#ffa502',
              },
              {
                icon: '📦',
                title: '50,000+',
                subtitle: 'Products Delivered',
                desc: 'Fast & secure shipping',
                color: '#667eea',
              },
              {
                icon: '🏆',
                title: '4.9/5',
                subtitle: 'Customer Rating',
                desc: 'Excellent service quality',
                color: '#43e97b',
              },
              {
                icon: '🎁',
                title: '24/7',
                subtitle: 'Customer Support',
                desc: 'Always here for you',
                color: '#f093fb',
              },
            ].map((item, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.08, y: -10 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '2px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: item.color,
                    },
                  }}
                >
                  <Typography variant="h1" sx={{ mb: 2, fontSize: '4rem' }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: item.color, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
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

      {/* Enhanced Newsletter with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 10, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ textAlign: 'center' }}
          >
            <Typography variant="h2" fontWeight={900} gutterBottom sx={{ mb: 2 }}>
              Stay in the Loop!
            </Typography>
            <Typography variant="h5" sx={{ mb: 5, opacity: 0.95 }}>
              Subscribe for exclusive deals, new arrivals, and special offers
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 650,
                mx: 'auto',
                flexDirection: { xs: 'column', sm: 'row' },
                mb: 3,
              }}
            >
              <Box
                component="input"
                placeholder="Enter your email address"
                sx={{
                  flex: 1,
                  px: 4,
                  py: 2.5,
                  borderRadius: 3,
                  border: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:focus': {
                    outline: '3px solid rgba(255,255,255,0.5)',
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 6,
                  py: 2.5,
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 30px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                icon={<Star />}
                label="10% off first order"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<LocalShipping />}
                label="Free shipping updates"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<CardGiftcard />}
                label="Exclusive deals"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
