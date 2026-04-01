import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import {
  AppButton,
  AppCard,
  AppCardContent,
  AppCardMedia,
  AppCardActions,
  AppBreadcrumbs,
  AppChip,
} from '../../../components/common';

export default function ProductDetailScreen() {
  const [quantity, setQuantity] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState('red');
  const [loading, setLoading] = useState(false);

  const product = {
    id: 1,
    name: 'Premium Red Roses',
    description: 'Fresh hand-picked roses perfect for romantic occasions',
    price: 3.5,
    originalPrice: 5.0,
    rating: 4.8,
    reviews: 287,
    badge: 'Fresh Today',
    image: 'https://via.placeholder.com/400x400?text=Premium+Red+Roses',
    colors: [
      { name: 'red', label: 'Red', hex: '#D32F2F' },
      { name: 'pink', label: 'Pink', hex: '#EC407A' },
      { name: 'yellow', label: 'Yellow', hex: '#FBC02D' },
      { name: 'orange', label: 'Orange', hex: '#FF7043' },
    ],
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Roses', path: '/shop' },
    { label: 'Premium Red Roses', path: '/product/1', active: true },
  ];

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 5) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <AppBreadcrumbs items={breadcrumbs} />
      </Box>

      {/* Product Details Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Product Image */}
        <Grid item xs={12} sm={12} md={5}>
          <AppCard sx={{ mb: 2 }}>
            <AppCardMedia image={product.image} alt={product.name} height={400} />
          </AppCard>

          {/* Image Thumbnails */}
          <Grid container spacing={1}>
            {[1, 2, 3, 4].map((_, idx) => (
              <Grid item xs={3} key={idx}>
                <Box
                  sx={{
                    width: '100%',
                    paddingBottom: '100%',
                    position: 'relative',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: idx === 0 ? 'primary.main' : 'divider',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    img: { width: '100%', height: '100%', objectFit: 'cover' },
                  }}
                >
                  <img
                    src="https://via.placeholder.com/80?text=Product"
                    alt="Thumbnail"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} sm={12} md={7}>
          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {product.badge && (
                  <AppChip
                    label={product.badge}
                    color="success"
                    variant="outlined"
                    size="small"
                    icon={<LocalFloristIcon sx={{ fontSize: 16 }} />}
                  />
                )}
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {product.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{ mt: -1 }}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" fontWeight={600}>
                {product.rating}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              ({product.reviews} reviews)
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ${product.price.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.originalPrice.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                per stem
              </Typography>
            </Box>
            <AppChip
              label="Fresh Today • Same-Day Delivery Available"
              color="success"
              variant="outlined"
              size="small"
              sx={{ bgcolor: 'success.lighter' }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Flower Color Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
              Flower Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.colors.map((color) => (
                <Box
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: color.hex,
                    border: '3px solid',
                    borderColor: selectedColor === color.name ? 'primary.main' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                  title={color.label}
                >
                  {selectedColor === color.name && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Number of Stems */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
              Number of Stems
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 5}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  px: 3,
                  textAlign: 'center',
                  minWidth: 60,
                  fontWeight: 600,
                }}
              >
                {quantity}
              </Typography>
              <IconButton size="small" onClick={() => handleQuantityChange(1)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Minimum: 5 stems
            </Typography>
          </Box>

          {/* Add to Cart Button */}
          <AppButton
            variant="contained"
            color="error"
            fullWidth
            size="large"
            endIcon={<AddIcon />}
            loading={loading}
            onClick={handleAddToCart}
            sx={{ mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
          >
            Add to Cart
          </AppButton>

          {/* Info Chips */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2">Same-day delivery for orders before 2 PM</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2">100% freshness guarantee</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CardGiftcardIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2">Complimentary gift message card</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteBorderOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2">Secure payment & satisfaction guaranteed</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 0,
            borderBottom: '2px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          {['Description', 'Specifications', 'Shipping'].map((tab) => (
            <Typography
              key={tab}
              variant="body2"
              fontWeight={600}
              sx={{
                pb: 1.5,
                px: 2,
                cursor: 'pointer',
                color: tab === 'Description' ? 'error.main' : 'text.secondary',
                borderBottom: tab === 'Description' ? '3px solid' : 'none',
                borderBottomColor: 'error.main',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {tab}
            </Typography>
          ))}
        </Box>

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Product Description
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            Experience premium quality with our hand-picked Wireless Bluetooth Headphones. Featuring advanced active
            noise cancellation technology, these headphones deliver crystal clear audio and immersive listening
            experience.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            With up to 30 hours of battery life and quick charge capability, you can enjoy your favorite music,
            podcasts, and calls all day long. The ergonomic design ensures maximum comfort during extended wear.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2">Active Noise Cancellation</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2">30-hour battery life</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2">Premium leather ear cushions</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2">Built-in microphone for calls</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Customer Reviews Section */}
      <AppCard>
        <AppCardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Customer Reviews
            </Typography>
            <AppButton variant="contained" color="error" size="small">
              Write a Review
            </AppButton>
          </Box>

          <Grid container spacing={3}>
            {/* Review Summary */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  4.2
                </Typography>
                <Rating value={4.2} precision={0.1} readOnly size="large" sx={{ justifyContent: 'center' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on 124 reviews
                </Typography>
              </Box>
            </Grid>

            {/* Rating Breakdown */}
            <Grid item xs={12} sm={8}>
              {[
                { stars: 5, percentage: 68, count: 5 },
                { stars: 4, percentage: 20, count: 4 },
                { stars: 3, percentage: 8, count: 3 },
                { stars: 2, percentage: 3, count: 2 },
                { stars: 1, percentage: 1, count: 1 },
              ].map((rating) => (
                <Box key={rating.stars} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {rating.stars} star
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      bgcolor: 'divider',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${rating.percentage}%`,
                        bgcolor: 'warning.main',
                        transition: 'width 0.3s',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
                    {rating.percentage}%
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Individual Reviews */}
          {[
            {
              name: 'Michael Chen',
              rating: 5,
              date: '2 days ago',
              text: 'Absolutely amazing headphones! The noise cancellation is superb and the sound quality is crystal clear. Battery life exceeds expectations.',
              helpful: 94,
            },
            {
              name: 'Sarah Williams',
              rating: 4,
              date: '1 week ago',
              text: 'Great headphones for the price. Comfortable to wear for long periods. Only minor issue is they could be a bit tighter on the head.',
              helpful: 12,
            },
          ].map((review, idx) => (
            <Box key={idx} sx={{ mb: 3, pb: 3, borderBottom: idx === 1 ? 'none' : '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" fontWeight={700}>
                    {review.name[0]}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {review.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                {review.text}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  👍 Helpful ({review.helpful})
                </Typography>
              </Box>
            </Box>
          ))}
        </AppCardContent>
      </AppCard>
    </Container>
  );
}
