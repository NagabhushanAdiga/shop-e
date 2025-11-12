import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Rating,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { loadProducts } from '../data/products';
import { formatCurrency } from '../utils/currency';

const MotionBox = motion(Box);

const MAX_QUANTITY_PER_PRODUCT = 5;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const products = loadProducts();
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setConfirmDialogOpen(true);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    const maxAllowed = Math.min(product.stock, MAX_QUANTITY_PER_PRODUCT);
    if (newQuantity >= 1 && newQuantity <= maxAllowed) {
      setQuantity(newQuantity);
    }
  };

  // For demo, using the same image (in real app, products would have multiple images)
  const productImages = [product.image, product.image, product.image];

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  mb: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <Box
                  component="img"
                  src={productImages[selectedImage]}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 450 },
                    objectFit: 'cover',
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transition: 'transform 0.3s ease-out',
                  }}
                />
                {!isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {isZoomed ? '🔍 Zoom In' : '🔍 Hover to Zoom'}
                  </Box>
                )}
              </Card>

              {/* Thumbnail Images */}
              <Grid container spacing={1}>
                {productImages.map((img, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      component="img"
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: 1,
                        border:
                          selectedImage === index
                            ? `3px solid ${theme.palette.primary.main}`
                            : '3px solid transparent',
                        transition: 'all 0.3s',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip label={product.category} sx={{ mb: 2 }} />
              
              <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom fontWeight={600}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.rating} rating)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" fontWeight={700} sx={{ mb: 3 }}>
                {formatCurrency(product.price)}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body1" paragraph color="text.secondary">
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Availability:{' '}
                  <Typography
                    component="span"
                    color={product.stock > 0 ? 'success.main' : 'error.main'}
                    fontWeight={600}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Typography>
                </Typography>
              </Box>

              <Alert severity="warning" icon={false} sx={{ mb: 3, fontWeight: 600 }}>
                ⚠️ NO RETURN | NO REFUND | NO EXCHANGE
              </Alert>

              <Divider sx={{ my: 3 }} />

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= Math.min(product.stock, MAX_QUANTITY_PER_PRODUCT)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    (Max: {MAX_QUANTITY_PER_PRODUCT} per order)
                  </Typography>
                </Box>
              </Box>

              {/* Add to Cart Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{
                  py: 1.5,
                  background:
                    product.stock > 0
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : undefined,
                  fontSize: '1.1rem',
                }}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              {/* Product Details Card */}
              <Card sx={{ mt: 3, bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Product Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Category:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {product.category}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Stock:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {product.stock} units
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        SKU:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        PROD-{product.id.toString().padStart(4, '0')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
        </Grid>

        {/* Success Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Added to Cart!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quantity} x {product.name} has been added to your cart.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              variant="outlined"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate('/cart')}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              View Cart
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProductDetail;

