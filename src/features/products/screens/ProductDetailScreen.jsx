import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppButton from '../../../components/common/AppButton';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import bannerImg from '../../../assets/flower-bouquet.png';
import { productService } from '../services/productService';
import { cartService } from '../../checkout/services/cartService';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { authService } from '../../auth/services/authService';

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    Promise.all([
      productService.getProductById(id),
      // reviews endpoint: GET /api/v1/reviews/product/{id}
      import('../../../core/network/ApiClient').then(({ default: apiClient }) => {
        const req = apiClient.get();
        req.url = `/api/v1/reviews/product/${id}`;
        req.query = { page: 0, size: 10 };
        return req.then((res) => res.data?.data ?? []).catch(() => []);
      }),
    ])
      .then(([prod, rev]) => {
        setProduct(prod);
        setReviews(rev);
      })
      .catch(() => setError('Failed to load product. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setAddingToCart(true);
    try {
      await cartService.addItem(product.productId, quantity);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } catch (err) {
      setError(err.message || 'Could not add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(product.productId);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(product.productId);
        setInWishlist(true);
      }
    } catch { }
    finally { setWishlistLoading(false); }
  };

  if (loading) {
    return (
      <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton height={40} width="80%" />
            <Skeleton height={30} width="40%" sx={{ mt: 1 }} />
            <Skeleton height={24} width="30%" sx={{ mt: 1 }} />
            <Skeleton height={100} sx={{ mt: 2 }} />
            <Skeleton height={50} sx={{ mt: 2 }} />
            <Skeleton height={50} sx={{ mt: 1 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error && !product) {
    return (
      <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <AppButton startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate(-1)}>Back</AppButton>
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <AppBreadcrumbs
        items={[
          { label: 'Shop', to: '/shop' },
          { label: product.categoryName || 'Products', to: `/shop?category=${product.categoryId}` },
          { label: product.name },
        ]}
      />

      {cartSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>Added to cart successfully!</Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={4} sx={{ mt: 0 }}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.primaryImageUrl || bannerImg}
            alt={product.name}
            sx={{ width: '100%', borderRadius: 3, boxShadow: 2, maxHeight: 480, objectFit: 'cover' }}
          />
          {product.imageUrls.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              {product.imageUrls.slice(0, 5).map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt={`View ${i + 1}`}
                  sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', cursor: 'pointer', border: '2px solid', borderColor: 'divider' }}
                />
              ))}
            </Stack>
          )}
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1.5}>
            {product.brandName && (
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                {product.brandName}
              </Typography>
            )}
            <Typography variant="h4" fontWeight={900}>{product.name}</Typography>

            {product.averageRating != null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={product.averageRating} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </Typography>
              </Box>
            )}

            <Typography variant="h4" color="primary.main" fontWeight={800}>
              {product.formattedPrice}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.categoryName && <Chip label={product.categoryName} size="small" />}
              <Chip
                label={product.isInStock ? `In Stock (${product.stockQty})` : 'Out of Stock'}
                color={product.isInStock ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
              {product.sku && <Chip label={`SKU: ${product.sku}`} size="small" variant="outlined" />}
            </Stack>

            {product.description && (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {product.description}
              </Typography>
            )}

            <Divider />

            {/* Quantity */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography fontWeight={600}>Quantity:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <AppButton
                  size="small"
                  variant="text"
                  sx={{ minWidth: 36 }}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <RemoveIcon fontSize="small" />
                </AppButton>
                <Typography sx={{ px: 2, fontWeight: 700 }}>{quantity}</Typography>
                <AppButton
                  size="small"
                  variant="text"
                  sx={{ minWidth: 36 }}
                  disabled={quantity >= product.stockQty}
                  onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
                >
                  <AddIcon fontSize="small" />
                </AppButton>
              </Box>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1.5}>
              <AppButton
                variant="contained"
                size="large"
                fullWidth
                loading={addingToCart}
                disabled={!product.isInStock}
                onClick={handleAddToCart}
              >
                {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
              </AppButton>
              <AppButton
                variant="outlined"
                size="large"
                sx={{ minWidth: 56 }}
                loading={wishlistLoading}
                onClick={handleWishlistToggle}
              >
                {inWishlist
                  ? <FavoriteIcon color="error" />
                  : <FavoriteBorderIcon />}
              </AppButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Customer Reviews</Typography>
          <Stack spacing={2}>
            {reviews.map((review) => (
              <Box
                key={review.reviewId}
                sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                    {(review.userFullName || 'U')[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700}>{review.userFullName}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                </Box>
                {review.comment && (
                  <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
