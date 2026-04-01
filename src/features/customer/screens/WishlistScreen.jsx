import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AppButton from '../../../components/common/AppButton';
import PageHeader from '../../../components/common/PageHeader';
import { ProductCard } from '../../../components/common/AppCard';
import bannerImg from '../../../assets/flower-bouquet.png';

const SAMPLE_WISHLIST = [
  { id: '1', name: 'Roses Bouquet', image: bannerImg, price: '$59.99', originalPrice: '$69.99', badge: '20% OFF' },
  { id: '2', name: 'Sunflower Mix', image: bannerImg, price: '$49.99', originalPrice: '$59.99', badge: 'New' },
  { id: '3', name: 'Orchid Classic', image: bannerImg, price: '$79.99' },
  { id: '4', name: 'Tulip Surprise', image: bannerImg, price: '$39.99', originalPrice: '$44.99' },
  { id: '5', name: 'Lily Elegance', image: bannerImg, price: '$69.99' },
];

export default function WishlistScreen() {
  const [items, setItems] = useState(SAMPLE_WISHLIST);

  const handleRemoveFromWishlist = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id) => {
    // TODO: Add to cart functionality
    console.log('Added to cart:', id);
  };

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      {/* Header */}
      <PageHeader
        title="My Wishlist"
        subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
        action={
          items.length > 0 ? (
            <AppButton size="small" variant="outlined" startIcon={<FavoriteBorderIcon />}>
              Share Wishlist
            </AppButton>
          ) : null
        }
      />

      {/* Wishlist Grid */}
      {items.length > 0 ? (
        <Grid container spacing={2}>
          {items.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                image={product.image}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                actions={
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <AppButton
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to cart
                    </AppButton>
                    <AppButton
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: 40, p: 0 }}
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </AppButton>
                  </Box>
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 2,
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 340 }}>
            Add your favorite flowers to your wishlist to save them for later and get exclusive offers.
          </Typography>
          <AppButton variant="contained">Continue Shopping</AppButton>
        </Box>
      )}
    </Box>
  );
}
