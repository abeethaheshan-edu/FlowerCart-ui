import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BoltIcon from '@mui/icons-material/Bolt';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AppButton from '../../../components/common/AppButton';
import AppModal from '../../../components/common/AppModal';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import bannerImg from '../../../assets/flower-bouquet.png';
import { productService } from '../services/productService';
import { cartService } from '../../checkout/services/cartService';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { authService } from '../../auth/services/authService';
import apiClient from '../../../core/network/ApiClient';


const FLOWER_COLORS = [
  { value: 'red',    hex: '#E53935', gradient: false },
  { value: 'pink',   hex: '#F06292', gradient: false },
  { value: 'white',  hex: '#F5F5F5', gradient: false },
  { value: 'yellow', hex: '#FDD835', gradient: false },
  { value: 'mixed',  gradient: true, from: '#FDD835', to: '#E53935' },
];


function Stars({ rating = 5, size = 18, interactive = false, onRate }) {
  return (
    <Box sx={{ display: 'flex', gap: '1px' }}>
      {[1,2,3,4,5].map((s) => {
        const filled = s <= Math.floor(rating);
        const half   = !filled && s === Math.ceil(rating) && rating % 1 >= 0.5;
        const Icon   = filled ? StarIcon : half ? StarHalfIcon : StarOutlineIcon;
        return (
          <Icon
            key={s}
            onClick={() => interactive && onRate && onRate(s)}
            sx={{
              fontSize: size,
              color: filled || half ? '#F5A623' : '#ddd',
              cursor: interactive ? 'pointer' : 'default',
              '&:hover': interactive ? { color: '#F5A623' } : {},
            }}
          />
        );
      })}
    </Box>
  );
}


function RatingBar({ star, pct }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
      <Typography variant="caption" sx={{ width: 36, color: 'text.secondary', flexShrink: 0 }}>
        {star} star
      </Typography>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          flex: 1, height: 8, borderRadius: 4,
          bgcolor: '#f0f0f0',
          '& .MuiLinearProgress-bar': { bgcolor: '#F5A623', borderRadius: 4 },
        }}
      />
      <Typography variant="caption" sx={{ width: 32, textAlign: 'right', color: 'text.secondary', flexShrink: 0 }}>
        {pct}%
      </Typography>
    </Box>
  );
}


function GuaranteeItem({ icon: Icon, text, color = '#E85D8E' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
      <Icon sx={{ fontSize: 18, color, flexShrink: 0 }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>{text}</Typography>
    </Box>
  );
}

function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(Math.floor(Math.random() * 30) + 5);
  const [clicked, setClicked] = useState(false);

  const timeAgo = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const diff = (Date.now() - d) / 1000;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return d.toLocaleDateString('en-US', { dateStyle: 'medium' });
  };

  return (
    <Box sx={{ py: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#E85D8E', fontSize: '0.9rem', fontWeight: 700 }}>
          {(review.userFullName || 'U')[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" fontWeight={700}>{review.userFullName}</Typography>
            <Typography variant="caption" color="text.secondary">{timeAgo(review.createdAt)}</Typography>
          </Box>
          <Stars rating={review.rating} size={15} />
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.2 }}>
        {review.comment}
      </Typography>
      <Box
        onClick={() => { if (!clicked) { setHelpful((h) => h + 1); setClicked(true); } }}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: clicked ? 'default' : 'pointer', color: 'text.secondary', '&:hover': { color: clicked ? 'text.secondary' : '#E85D8E' } }}
      >
        <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption">Helpful ({helpful})</Typography>
      </Box>
    </Box>
  );
}


function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}


function LoadingSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map((i) => <Skeleton key={i} variant="rectangular" width={64} height={64} sx={{ borderRadius: 2 }} />)}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton width="70%" height={40} />
          <Skeleton width="50%" height={20} sx={{ mt: 1 }} />
          <Skeleton width="30%" height={50} sx={{ mt: 2 }} />
          <Skeleton height={80} sx={{ mt: 2 }} />
          <Skeleton height={56} sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product,        setProduct]        = useState(null);
  const [reviews,        setReviews]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [selectedImg,    setSelectedImg]    = useState(0);
  const [selectedColor,  setSelectedColor]  = useState('red');
  const [quantity,       setQuantity]       = useState(5);
  const [addingToCart,   setAddingToCart]   = useState(false);
  const [buyNowLoading,  setBuyNowLoading]  = useState(false);
  const [inWishlist,     setInWishlist]     = useState(false);
  const [wishlistLoading,setWishlistLoading]= useState(false);
  const [tab,            setTab]            = useState(0);
  const [snack,          setSnack]          = useState({ open: false, msg: '', sev: 'success' });
  const [reviewDialog,   setReviewDialog]   = useState(false);
  const [newReview,      setNewReview]      = useState({ rating: 5, comment: '' });
  const [submitting,     setSubmitting]     = useState(false);
  const [loginPopup,     setLoginPopup]     = useState(false);

  const showSnack = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');

    Promise.all([
      productService.getProductById(id),
      (() => {
        const req = apiClient.get();
        req.url = `/reviews/product/${id}`;
        req.query = { page: 0, size: 20 };
        return req.then((res) => res.data?.data ?? []).catch(() => []);
      })(),
    ])
      .then(([prod, revs]) => {
        setProduct(prod);
        setReviews(revs);
        /* check wishlist */
        if (authService.isAuthenticated()) {
          wishlistService.getWishlist()
            .then((items) => setInWishlist(items.some((p) => p.productId === prod.productId)))
            .catch(() => {});
        }
      })
      .catch(() => setError('Failed to load product. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);


  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    if (!product.isInStock) return;
    setAddingToCart(true);
    try {
      await cartService.addItem(product.productId, quantity);
      showSnack('Added to cart successfully! 🛒');
    } catch (err) {
      showSnack(err.message || 'Could not add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!authService.isAuthenticated()) { setLoginPopup(true); return; }
    if (!product.isInStock) return;
    setBuyNowLoading(true);
    try {
      await cartService.addItem(product.productId, quantity);
      navigate('/cart');
    } catch (err) {
      showSnack(err.message || 'Could not process. Please try again.', 'error');
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(product.productId);
        setInWishlist(false);
        showSnack('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product.productId);
        setInWishlist(true);
        showSnack('Added to wishlist ❤️');
      }
    } catch { showSnack('Wishlist update failed', 'error'); }
    finally { setWishlistLoading(false); }
  };

  const handleSubmitReview = async () => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    if (!newReview.comment.trim()) return;
    setSubmitting(true);
    try {
      const req = apiClient.post();
      req.url = '/reviews';
      req.body = { productId: Number(id), rating: newReview.rating, comment: newReview.comment };
      const res = await req;
      setReviews((prev) => [res.data, ...prev]);
      setReviewDialog(false);
      setNewReview({ rating: 5, comment: '' });
      showSnack('Review submitted! Thank you.');
    } catch (err) {
      showSnack(err.message || 'Could not submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };


  const images = product?.imageUrls?.length ? product.imageUrls : [bannerImg];
  const avgRating = product?.averageRating ?? (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0);
  const reviewCount = product?.reviewCount ?? reviews.length;

  const ratingBreakdown = [5,4,3,2,1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : star === 5 ? 68 : star === 4 ? 20 : star === 3 ? 8 : star === 2 ? 3 : 1;
    return { star, pct };
  });


  if (loading) return <LoadingSkeleton />;
  if (error && !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <AppButton startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Go Back</AppButton>
      </Container>
    );
  }
  if (!product) return null;

   return (
    <Box sx={{ bgcolor: 'background.default', pb: 8 }}>
      <Container maxWidth="lg">

        {/* Breadcrumbs */}
        <Box sx={{ pt: 2.5, pb: 0.5 }}>
          <AppBreadcrumbs items={[
            { label: 'Home', to: '/' },
            { label: product.categoryName || 'Flowers', to: product.categoryId ? `/shop?category=${product.categoryId}` : '/shop' },
            { label: product.name },
          ]} />
        </Box>

        {snack.open && snack.sev === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
        )}

        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ mt: 0 }}>

          <Grid item xs={12} md={5}>
            <Box sx={{
              borderRadius: 3, border: '1px solid', borderColor: 'divider',
              bgcolor: '#fafafa', overflow: 'hidden', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: { xs: 260, md: 380 }, p: 2,
            }}>
              {product.isInStock && (
                <Box sx={{
                  position: 'absolute', top: 14, right: 14, zIndex: 2,
                  bgcolor: '#e8f5e9', border: '1px solid #c8e6c9',
                  borderRadius: 50, px: 1.5, py: 0.4,
                  display: 'flex', alignItems: 'center', gap: 0.5,
                }}>
                  <EmojiNatureOutlinedIcon sx={{ fontSize: 13, color: '#43a047' }} />
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2e7d32' }}>Fresh Today</Typography>
                </Box>
              )}
              <Box
                component="img"
                src={images[selectedImg] || bannerImg}
                alt={product.name}
                sx={{ maxWidth: '100%', maxHeight: { xs: 220, md: 340 }, objectFit: 'contain', display: 'block' }}
              />
            </Box>

            {/* Thumbnails */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                {images.slice(0, 5).map((url, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    component="img"
                    src={url}
                    alt={`view ${i + 1}`}
                    sx={{
                      width: 64, height: 64, objectFit: 'cover', borderRadius: 2,
                      cursor: 'pointer', border: '2px solid',
                      borderColor: selectedImg === i ? '#E85D8E' : 'divider',
                      transition: 'border-color 0.15s',
                      '&:hover': { borderColor: '#E85D8E' },
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Right — details */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Name + short desc */}
              <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5, fontFamily: "'Playfair Display', Georgia, serif", fontSize: { xs: '1.6rem', md: '2rem' } }}>
                {product.name}
              </Typography>
              {product.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                  {product.description.split('.')[0]}.
                </Typography>
              )}

              {/* Rating row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Stars rating={avgRating} size={18} />
                <Typography fontWeight={700} sx={{ fontSize: '0.95rem' }}>{avgRating.toFixed(1)}</Typography>
                <Typography variant="body2" color="text.secondary">({reviewCount} reviews)</Typography>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: 'text.primary' }}>
                  {product.formattedPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">per stem</Typography>
              </Box>

              {/* Fresh + same-day banner */}
              <Box sx={{
                bgcolor: '#f1f8e9', border: '1px solid #c5e1a5', borderRadius: 2,
                px: 2, py: 1.2, mb: 2.5,
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <CheckCircleOutlineIcon sx={{ color: '#43a047', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  Fresh Today &bull; Same-Day Delivery Available
                </Typography>
              </Box>

              {/* Color selector */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1.2 }}>Flower Color</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {FLOWER_COLORS.map((c) => (
                    <Box
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      title={c.label}
                      sx={{
                        width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                        background: c.gradient ? `linear-gradient(135deg, ${c.from}, ${c.to})` : c.hex,
                        border: selectedColor === c.value ? '2.5px solid #E85D8E' : '2px solid transparent',
                        outline: selectedColor === c.value ? '2px solid rgba(232,93,142,0.4)' : '2px solid #e0e0e0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.15s',
                        '&:hover': { transform: 'scale(1.12)' },
                      }}
                    >
                      {selectedColor === c.value && <CheckIcon sx={{ fontSize: 16, color: c.value === 'white' ? '#666' : '#fff' }} />}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Quantity / stems */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1.2 }}>Number of Stems</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <IconButton
                    size="small"
                    disabled={quantity <= 5}
                    onClick={() => setQuantity((q) => Math.max(5, q - 1))}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, mr: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{
                    border: '1px solid', borderColor: 'divider', borderLeft: 'none', borderRight: 'none',
                    px: 2.5, py: 0.8, minWidth: 60, textAlign: 'center',
                  }}>
                    <Typography fontWeight={700}>{quantity}</Typography>
                  </Box>
                  <IconButton
                    size="small"
                    disabled={quantity >= (product.stockQty || 999)}
                    onClick={() => setQuantity((q) => q + 1)}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Minimum: 5 stems
                </Typography>
              </Box>

              {/* Action buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <AppButton
                  size="large"
                  fullWidth
                  loading={addingToCart}
                  disabled={!product.isInStock}
                  startIcon={!addingToCart && <ShoppingCartOutlinedIcon />}
                  onClick={handleAddToCart}
                  sx={{
                    bgcolor: product.isInStock ? '#E85D8E' : undefined,
                    color: product.isInStock ? '#fff' : undefined,
                    fontWeight: 700, fontSize: '1rem', py: 1.5, borderRadius: 2,
                    '&:hover': { bgcolor: product.isInStock ? '#C94375' : undefined },
                  }}
                >
                  {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
                </AppButton>

                <AppButton
                  size="large"
                  fullWidth
                  loading={buyNowLoading}
                  disabled={!product.isInStock}
                  startIcon={!buyNowLoading && <BoltIcon />}
                  onClick={handleBuyNow}
                  sx={{
                    bgcolor: product.isInStock ? '#1a1a2e' : undefined,
                    color: product.isInStock ? '#fff' : undefined,
                    fontWeight: 700, fontSize: '1rem', py: 1.5, borderRadius: 2,
                    '&:hover': { bgcolor: product.isInStock ? '#2d2d44' : undefined },
                  }}
                >
                  Buy Now
                </AppButton>

                <IconButton
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  sx={{
                    width: 52, height: 52, border: '1px solid', borderColor: 'divider',
                    borderRadius: 2, flexShrink: 0,
                    '&:hover': { borderColor: '#E85D8E', bgcolor: '#fce4ec' },
                  }}
                >
                  {inWishlist
                    ? <FavoriteIcon sx={{ color: '#E85D8E' }} />
                    : <FavoriteBorderIcon sx={{ color: 'text.secondary' }} />}
                </IconButton>
              </Box>

              {/* Guarantees */}
              <Box>
                <GuaranteeItem icon={LocalShippingOutlinedIcon}   text="Same-day delivery for orders before 2 PM" color="#E85D8E" />
                <GuaranteeItem icon={CheckCircleOutlineIcon}       text="100% freshness guarantee" color="#43a047" />
                <GuaranteeItem icon={CardGiftcardOutlinedIcon}     text="Complimentary gift message card" color="#E85D8E" />
                <GuaranteeItem icon={SecurityOutlinedIcon}         text="Secure payment & satisfaction guaranteed" color="#E85D8E" />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 3, borderBottom: '1px solid', borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 52 },
              '& .Mui-selected': { color: '#E85D8E' },
              '& .MuiTabs-indicator': { bgcolor: '#E85D8E' },
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Shipping" />
          </Tabs>

          <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
            {/* Description */}
            <TabPanel value={tab} index={0}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Product Description</Typography>
              {product.description ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                  {/* Feature bullets */}
                  <Box>
                    {['Hand-picked and freshly cut', '100% freshness guaranteed', 'Available in multiple arrangements', 'Same-day delivery for orders before 2 PM'].map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <CheckIcon sx={{ color: '#43a047', fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">No description available.</Typography>
              )}
            </TabPanel>

            {/* Specifications */}
            <TabPanel value={tab} index={1}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Specifications</Typography>
              {[
                ['SKU',       product.sku || 'N/A'],
                ['Category',  product.categoryName || 'N/A'],
                ['Brand',     product.brandName || 'N/A'],
                ['Stock',     product.isInStock ? `${product.stockQty} available` : 'Out of stock'],
                ['Status',    product.status],
              ].map(([k, v]) => (
                <Box key={k} sx={{ display: 'flex', gap: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>{k}</Typography>
                  <Typography variant="body2" fontWeight={600}>{v}</Typography>
                </Box>
              ))}
            </TabPanel>

            {/* Shipping */}
            <TabPanel value={tab} index={2}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Shipping Information</Typography>
              {[
                ['Standard Delivery', 'Free on orders over $75 (2-3 days)'],
                ['Same-Day Delivery', 'Order before 2 PM — $5.99'],
                ['Express Delivery',  'Next morning — $12.99'],
                ['Freshness Policy',  '7-day freshness guarantee or replacement'],
              ].map(([k, v]) => (
                <Box key={k} sx={{ display: 'flex', gap: 2, py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={700} sx={{ width: 160, flexShrink: 0 }}>{k}</Typography>
                  <Typography variant="body2" color="text.secondary">{v}</Typography>
                </Box>
              ))}
            </TabPanel>
          </Box>
        </Box>

        {/* ── REVIEWS ── */}
        <Box sx={{ mt: 5 }}>
          {/* Reviews header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" fontWeight={800}>Customer Reviews</Typography>
            <AppButton
              onClick={() => authService.isAuthenticated() ? setReviewDialog(true) : navigate('/auth/login')}
              sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#C94375' } }}
            >
              Write a Review
            </AppButton>
          </Box>

          {/* Rating summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Big score */}
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={{
                bgcolor: '#fce4ec', borderRadius: 3, p: 3, textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <Typography sx={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: 'text.primary' }}>
                  {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                </Typography>
                <Stars rating={avgRating} size={20} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.8 }}>
                  Based on {reviewCount} reviews
                </Typography>
              </Box>
            </Grid>

            {/* Bar chart */}
            <Grid item xs={12} sm={8} md={9}>
              <Box sx={{ pt: { xs: 0, sm: 1 } }}>
                {ratingBreakdown.map((rb) => (
                  <RatingBar key={rb.star} star={rb.star} pct={rb.pct} />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Review list */}
          {reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '2px dashed', borderColor: 'divider', borderRadius: 3 }}>
              <StarIcon sx={{ fontSize: 48, color: '#F5A623', mb: 1, opacity: 0.4 }} />
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>No reviews yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Be the first to review this product!
              </Typography>
              <AppButton
                onClick={() => authService.isAuthenticated() ? setReviewDialog(true) : navigate('/auth/login')}
                sx={{ bgcolor: '#E85D8E', color: '#fff', borderRadius: 50, px: 3, '&:hover': { bgcolor: '#C94375' } }}
              >
                Write a Review
              </AppButton>
            </Box>
          ) : (
            <Box>
              {reviews.map((r, i) => (
                <Box key={r.reviewId ?? i}>
                  <ReviewCard review={r} />
                  {i < reviews.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* ── WRITE REVIEW DIALOG ── */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2.5, mt: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Your Rating</Typography>
            <Stars rating={newReview.rating} size={28} interactive onRate={(v) => setNewReview((r) => ({ ...r, rating: v }))} />
          </Box>
          <TextField
            label="Your review"
            multiline
            rows={4}
            fullWidth
            value={newReview.comment}
            onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
            placeholder="Share your experience with this product…"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <AppButton variant="outlined" onClick={() => setReviewDialog(false)} sx={{ borderColor: 'divider', color: 'text.secondary' }}>
            Cancel
          </AppButton>
          <AppButton
            loading={submitting}
            disabled={!newReview.comment.trim()}
            onClick={handleSubmitReview}
            sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#C94375' } }}
          >
            Submit Review
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* ── LOGIN REQUIRED POPUP ── */}
      <AppModal
        open={loginPopup}
        onClose={() => setLoginPopup(false)}
        title=""
        maxWidth="xs"
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end' }}>
            <AppButton
              variant="outlined"
              onClick={() => setLoginPopup(false)}
              sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
            >
              Cancel
            </AppButton>
            <AppButton
              onClick={() => { setLoginPopup(false); navigate('/auth/login', { state: { from: `/product/${id}` } }); }}
              sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#C94375' } }}
            >
              Go to Login
            </AppButton>
          </Box>
        }
      >
        <Box sx={{ textAlign: 'center', py: 1.5 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            bgcolor: '#fce4ec', display: 'flex', alignItems: 'center',
            justifyContent: 'center', mx: 'auto', mb: 2.5,
          }}>
            <LockOutlinedIcon sx={{ fontSize: 30, color: '#E85D8E' }} />
          </Box>

          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            Login Required
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7, maxWidth: 280, mx: 'auto' }}>
            You need to be logged in to purchase flowers.
            Sign in to your account to continue with your order.
          </Typography>

          <Box sx={{
            bgcolor: '#fdf2f6', border: '1px solid #fce4ec',
            borderRadius: 2, px: 2, py: 1.5, mb: 1,
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
              Don't have an account?{' '}
              <Box
                component="span"
                onClick={() => { setLoginPopup(false); navigate('/auth/register'); }}
                sx={{ color: '#E85D8E', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Create one free →
              </Box>
            </Typography>
          </Box>
        </Box>
      </AppModal>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ minWidth: 250 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}