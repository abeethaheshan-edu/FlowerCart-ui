import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AppButton from '../../../components/common/AppButton';
import PageHeader from '../../../components/common/PageHeader';
import { ProductCard } from '../../../components/common/AppCard';
import bannerImg from '../../../assets/flower-bouquet.png';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { cartService } from '../../checkout/services/cartService';
import { authService } from '../../auth/services/authService';

function ProductSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
      <Skeleton width="70%" /><Skeleton width="40%" />
    </Box>
  );
}

export default function WishlistScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setLoading(true);
    wishlistService.getWishlist()
      .then(setItems)
      .catch(() => setError('Failed to load wishlist. Please try again.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      setError(err.message || 'Could not remove item.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product.productId);
    try {
      await cartService.addItem(product.productId, 1);
    } catch (err) {
      setError(err.message || 'Could not add to cart.');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <PageHeader
        title="My Wishlist"
        subtitle={loading ? '' : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
        action={
          items.length > 0 ? (
            <AppButton size="small" variant="outlined" startIcon={<FavoriteBorderIcon />}>
              Share Wishlist
            </AppButton>
          ) : null
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
              <ProductSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : items.length > 0 ? (
        <Grid container spacing={2}>
          {items.map((product) => (
            <Grid key={product.productId} item xs={12} sm={6} md={4} lg={3}>
              <ProductCard
                image={product.primaryImageUrl || bannerImg}
                name={product.name}
                price={product.formattedPrice}
                badge={product.isLowStock ? 'Low Stock' : null}
                onClick={() => navigate(`/product/${product.productId}`)}
                actions={
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <AppButton
                      size="small"
                      variant="contained"
                      fullWidth
                      loading={addingToCart === product.productId}
                      disabled={!product.isInStock}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    >
                      {product.isInStock ? 'Add to cart' : 'Out of stock'}
                    </AppButton>
                    <AppButton
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: 40, p: 0 }}
                      loading={removingId === product.productId}
                      onClick={(e) => { e.stopPropagation(); handleRemove(product.productId); }}
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
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', py: 8, px: 2, borderRadius: 3,
            border: '2px dashed', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center',
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Your wishlist is empty</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 340 }}>
            Add your favorite flowers to your wishlist to save them for later.
          </Typography>
          <AppButton variant="contained" onClick={() => navigate('/shop')}>Browse Flowers</AppButton>
        </Box>
      )}
    </Box>
  );
}
