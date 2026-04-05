import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import AppButton from '../../../components/common/AppButton';
import bannerImg from '../../../assets/flower-bouquet.png';
import { productService } from '../../products/services/productService';
import { cartService } from '../../checkout/services/cartService';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { authService } from '../../auth/services/authService';

function Stars({ rating = 5, size = 16 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={i} sx={{ color: '#F5A623', fontSize: size }} />
      ))}
      {half && <StarHalfIcon sx={{ color: '#F5A623', fontSize: size }} />}
    </Box>
  );
}

const FEATURES = [
  { icon: LocalShippingOutlinedIcon, label: 'Same-Day Delivery', sub: 'Order by 2 PM' },
  { icon: CheckCircleOutlineIcon, label: 'Fresh Guarantee', sub: '7-day freshness' },
  { icon: LocalFloristOutlinedIcon, label: 'Handcrafted', sub: 'By expert florists' },
  { icon: CardGiftcardOutlinedIcon, label: 'Free Message Card', sub: 'Personal touch' },
];

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/60?img=47',
    rating: 5,
    text: '"The quality of the flowers is absolutely top-notch. Shipping was incredibly fast, and the packaging felt very premium. Will definitely shop here again!"',
  },
  {
    id: 't2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/60?img=11',
    rating: 5,
    text: '"I love the fresh bouquets from FlowerCart. Finding what I wanted was so easy. The customer support team was also super helpful when I had a question."',
  },
  {
    id: 't3',
    name: 'David Miller',
    avatar: 'https://i.pravatar.cc/60?img=52',
    rating: 4.5,
    text: '"FlowerCart has the best selection of exclusive arrangements. I managed to get a bouquet that was sold out everywhere else. Highly recommended!"',
  },
];

function ProductSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <Skeleton variant="rectangular" height={220} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="45%" height={12} sx={{ mb: 0.8 }} />
        <Skeleton width="80%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton width="35%" height={26} sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" height={34} sx={{ borderRadius: 1.5 }} />
      </Box>
    </Box>
  );
}

function HomeProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  cartLoading,
  wishlisted,
  onNavigate,
}) {
  return (
    <Box
      onClick={() => onNavigate(product.productId)}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 16px 40px rgba(232,93,142,0.18)',
        },
      }}
    >
      {/* Badge */}
      {product.badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            bgcolor: product.badge.toLowerCase().includes('new') ? '#1a1a2e' : '#E85D8E',
            color: '#fff',
            px: 1.2,
            py: 0.4,
            borderRadius: 1.5,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          {product.badge}
        </Box>
      )}

      {/* Wishlist btn */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          width: 32,
          height: 32,
          bgcolor: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(0,0,0,0.06)',
          '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' },
          transition: 'transform 0.15s',
        }}
      >
        {wishlisted ? (
          <FavoriteIcon sx={{ fontSize: 15, color: '#E85D8E' }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: 15, color: '#888' }} />
        )}
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        src={product.primaryImageUrl || bannerImg}
        alt={product.name}
        sx={{
          width: '100%',
          height: { xs: 170, sm: 200, md: 220 },
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Content */}
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        {product.categoryName && (
          <Typography
            sx={{
              fontSize: '0.68rem',
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              mb: 0.4,
            }}
          >
            {product.categoryName}
          </Typography>
        )}

        <Typography
          fontWeight={700}
          noWrap
          sx={{ fontSize: { xs: '0.88rem', md: '0.95rem' }, mb: 0.6, color: 'text.primary' }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              fontWeight={800}
              sx={{ color: '#E85D8E', fontSize: { xs: '1rem', md: '1.1rem' } }}
            >
              {product.formattedPrice}
            </Typography>
            {product.originalPrice && (
              <Typography
                sx={{ color: 'text.secondary', textDecoration: 'line-through', fontSize: '0.8rem' }}
              >
                ${Number(product.originalPrice).toFixed(2)}
              </Typography>
            )}
          </Box>
          {product.averageRating != null && <Stars rating={product.averageRating} size={13} />}
        </Box>

        <AppButton
          size="small"
          fullWidth
          loading={cartLoading}
          disabled={!product.isInStock}
          startIcon={
            !cartLoading && <ShoppingCartOutlinedIcon sx={{ fontSize: '14px !important' }} />
          }
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          sx={{
            bgcolor: product.isInStock ? '#E85D8E' : undefined,
            color: product.isInStock ? '#fff' : undefined,
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 1.5,
            py: 0.9,
            '&:hover': { bgcolor: product.isInStock ? '#C94375' : undefined },
          }}
        >
          {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
        </AppButton>
      </Box>
    </Box>
  );
}

function TestimonialCard({ t }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(232,93,142,0.07)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stars rating={t.rating} size={17} />
        <Typography
          sx={{
            fontSize: '3rem',
            lineHeight: 0.6,
            color: '#F5A623',
            opacity: 0.2,
            fontFamily: 'Georgia',
            mt: 1,
          }}
        >
          "
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.8, flexGrow: 1, mb: 2.5, fontSize: { xs: '0.87rem', md: '0.92rem' } }}
      >
        {t.text}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar src={t.avatar} sx={{ width: 42, height: 42, border: '2px solid #fce4ec' }} />
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {t.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VerifiedIcon sx={{ fontSize: 11, color: '#43a047' }} />
            <Typography variant="caption" color="text.secondary">
              Verified Buyer
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [slideIdx, setSlideIdx] = useState(0);

  const showSnack = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  useEffect(() => {
    setLoading(true);
    productService
      .getProducts({ page: 0, size: 8, sortBy: 'createdAt', direction: 'desc' })
      .then((paged) => setProducts(paged.data ?? []))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated()) return;
    wishlistService
      .getWishlist()
      .then((items) => setWishlist(new Set(items.map((p) => p.productId))))
      .catch(() => {});
  }, []);

  const handleAddToCart = useCallback(
    async (product) => {
      if (!authService.isAuthenticated()) {
        navigate('/auth/login');
        return;
      }
      setCartLoading(product.productId);
      try {
        await cartService.addItem(product.productId, 1);
        showSnack(`${product.name} added to cart!`);
      } catch (err) {
        showSnack(err.message || 'Could not add to cart', 'error');
      } finally {
        setCartLoading(null);
      }
    },
    [navigate],
  );

  const handleToggleWishlist = useCallback(
    async (product) => {
      if (!authService.isAuthenticated()) {
        navigate('/auth/login');
        return;
      }
      const pid = product.productId;
      const isIn = wishlist.has(pid);
      setWishlist((prev) => {
        const s = new Set(prev);
        isIn ? s.delete(pid) : s.add(pid);
        return s;
      });
      try {
        if (isIn) {
          await wishlistService.removeFromWishlist(pid);
          showSnack('Removed from wishlist');
        } else {
          await wishlistService.addToWishlist(pid);
          showSnack('Added to wishlist ❤️');
        }
      } catch {
        setWishlist((prev) => {
          const s = new Set(prev);
          isIn ? s.add(pid) : s.delete(pid);
          return s;
        });
        showSnack('Wishlist update failed', 'error');
      }
    },
    [navigate, wishlist],
  );

  const prevSlide = () => setSlideIdx((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const nextSlide = () => setSlideIdx((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));

  return (
    <Box margin={10}>
      <Box sx={{ bgcolor: '#FDF6F9', overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={{ xs: 0, md: 4 }}
            justifyContent="space-between"
            sx={{
              py: { xs: 5, md: 0 },
              minHeight: { md: '88vh' },
              display: 'flex',
            }}
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 6 }, pt: { xs: 0, md: 2 } }}>
                <Chip
                  icon={
                    <EmojiNatureOutlinedIcon
                      sx={{ fontSize: '13px !important', color: '#2e7d32 !important' }}
                    />
                  }
                  label="Fresh Spring Collection 2025"
                  size="small"
                  sx={{
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                    fontWeight: 600,
                    fontSize: '0.73rem',
                    mb: 3,
                    border: '1px solid #c8e6c9',
                    '& .MuiChip-icon': { ml: '6px' },
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    lineHeight: 1.06,
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem', lg: '4rem' },
                    mb: 2.5,
                    color: 'text.primary',
                  }}
                >
                  Celebrate Every
                  <Box
                    component="span"
                    sx={{ display: 'block', color: '#E85D8E', fontStyle: 'italic' }}
                  >
                    Beautiful Moment
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    maxWidth: 480,
                    lineHeight: 1.75,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  Handcrafted floral arrangements delivered fresh to your door. Each bouquet tells a
                  story of love, celebration, and natural beauty.
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3.5 }}>
                  <AppButton
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/shop')}
                    sx={{
                      bgcolor: '#E85D8E',
                      color: '#fff',
                      fontWeight: 700,
                      px: { xs: 3, md: 4 },
                      py: 1.5,
                      borderRadius: 50,
                      fontSize: { xs: '0.9rem', md: '0.97rem' },
                      boxShadow: '0 8px 24px rgba(232,93,142,0.35)',
                      '&:hover': {
                        bgcolor: '#C94375',
                        boxShadow: '0 10px 28px rgba(232,93,142,0.45)',
                      },
                    }}
                  >
                    Shop Bouquets
                  </AppButton>
                  <AppButton
                    variant="outlined"
                    size="large"
                    startIcon={<LocalShippingOutlinedIcon />}
                    onClick={() => navigate('/shop')}
                    sx={{
                      borderColor: '#E85D8E',
                      color: '#E85D8E',
                      fontWeight: 600,
                      px: { xs: 2.5, md: 3.5 },
                      py: 1.5,
                      borderRadius: 50,
                      fontSize: { xs: '0.9rem', md: '0.97rem' },
                      bgcolor: 'transparent',
                      '&:hover': { borderColor: '#C94375', bgcolor: '#fce4ec' },
                    }}
                  >
                    Same-Day Delivery
                  </AppButton>
                </Box>

                {/* Social proof */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AvatarGroup
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 34,
                        height: 34,
                        border: '2px solid #fce4ec',
                        fontSize: '0.75rem',
                      },
                    }}
                  >
                    {[
                      'https://i.pravatar.cc/40?img=47',
                      'https://i.pravatar.cc/40?img=32',
                      'https://i.pravatar.cc/40?img=21',
                    ].map((s, i) => (
                      <Avatar key={i} src={s} />
                    ))}
                  </AvatarGroup>
                  <Box>
                    <Stars rating={5} size={14} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      4.9/5 from 3,200+ happy customers
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  mt: { xs: 3, md: 0 },
                }}
              >
                {/* Pink circle bg */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '8%',
                    right: { xs: '8%', md: '-2%' },
                    width: { xs: 240, sm: 320, md: 440 },
                    height: { xs: 240, sm: 320, md: 440 },
                    borderRadius: '50%',
                    bgcolor: '#fce4ec',
                    zIndex: 0,
                  }}
                />

                {/* Eco badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 16, md: 40 },
                    left: { xs: 24, md: 40 },
                    zIndex: 3,
                    bgcolor: '#fff',
                    borderRadius: 3,
                    px: 1.5,
                    py: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: 2,
                      bgcolor: '#e8f5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmojiNatureOutlinedIcon sx={{ color: '#43a047', fontSize: 16 }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.62rem', color: 'text.secondary', lineHeight: 1 }}
                    >
                      100% Natural
                    </Typography>
                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, lineHeight: 1.3 }}>
                      Eco-Friendly
                    </Typography>
                  </Box>
                </Box>

                <Box
                  component="img"
                  src={bannerImg}
                  alt="Fresh bouquet"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: { xs: '78%', sm: '60%', md: '88%' },
                    maxWidth: 500,
                    objectFit: 'cover',
                    filter: 'drop-shadow(0 20px 40px rgba(232,93,142,0.2))',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 4, md: 5 },
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 3, md: 2 }}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Grid item xs={6} sm={3} key={f.label}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 50, md: 58 },
                        height: { xs: 50, md: 58 },
                        borderRadius: '50%',
                        bgcolor: '#fce4ec',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 24, md: 28 }, color: '#E85D8E' }} />
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.25 }}>
                      {f.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {f.sub}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          {/* Section header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 1 } }}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                mb: 1,
              }}
            >
              Trending Now
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our most popular products this week, curated just for you.
            </Typography>
          </Box>

          {/* View all link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 2, md: 3 } }}>
            <AppButton
              variant="text"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/shop')}
              sx={{ color: '#E85D8E', fontWeight: 600, fontSize: '0.87rem' }}
            >
              View all categories
            </AppButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <ProductSkeleton />
                  </Grid>
                ))
              : products.map((product) => (
                  <Grid item xs={6} sm={4} md={3} key={product.productId}>
                    <HomeProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      cartLoading={cartLoading === product.productId}
                      wishlisted={wishlist.has(product.productId)}
                      onNavigate={(id) => navigate(`/product/${id}`)}
                    />
                  </Grid>
                ))}
          </Grid>

          {/* Mobile view-all button */}
          {!loading && products.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4, display: { xs: 'block', md: 'none' } }}>
              <AppButton
                variant="outlined"
                onClick={() => navigate('/shop')}
                sx={{
                  borderColor: '#E85D8E',
                  color: '#E85D8E',
                  borderRadius: 50,
                  px: 4,
                  fontWeight: 600,
                }}
              >
                View All Products
              </AppButton>
            </Box>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: '#FDF6F9' }}>
        <Container maxWidth="xl">
          {/* Header row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: { xs: 3, md: 5 },
            }}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
                  mb: 1,
                }}
              >
                What Our Customers Say
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Trusted by over 10,000 happy customers worldwide.
              </Typography>
            </Box>
            {/* Nav arrows */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={prevSlide}
                sx={{
                  width: 40,
                  height: 40,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: '#fce4ec', borderColor: '#E85D8E' },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#E85D8E',
                  color: '#fff',
                  '&:hover': { bgcolor: '#C94375' },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid container spacing={3}>
              {TESTIMONIALS.map((t) => (
                <Grid item md={4} key={t.id}>
                  <TestimonialCard t={t} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <TestimonialCard t={TESTIMONIALS[slideIdx]} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
              {TESTIMONIALS.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    cursor: 'pointer',
                    width: i === slideIdx ? 24 : 8,
                    bgcolor: i === slideIdx ? '#E85D8E' : 'divider',
                    transition: 'width 0.25s',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.sev}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ minWidth: 260 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
