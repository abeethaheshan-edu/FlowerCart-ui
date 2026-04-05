import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppButton from '../../../components/common/AppButton';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';
import { authService } from '../../auth/services/authService';
import bannerImg from '../../../assets/flower-bouquet.png';

const TRUST_BADGES = [
  { icon: LockOutlinedIcon,          label: 'Secure Payment',  sub: 'SSL Encrypted' },
  { icon: ReplayIcon,                label: 'Easy Returns',    sub: '30-Day Policy' },
  { icon: SupportAgentIcon,          label: '24/7 Support',    sub: 'Always Here' },
  { icon: LocalShippingOutlinedIcon, label: 'Fast Shipping',   sub: 'Worldwide' },
];

function CartItemRow({ item, onUpdate, onRemove, loading }) {
  const isLowStock = item.stockQty != null && item.stockQty <= 5 && item.stockQty > 0;

  return (
    <Box sx={{ display: 'flex', gap: 2.5, py: 3 }}>
      <Box
        component="img"
        src={item.primaryImageUrl || bannerImg}
        alt={item.productName}
        sx={{
          width: 90, height: 90, borderRadius: 2.5,
          objectFit: 'cover', flexShrink: 0,
          border: '1px solid', borderColor: 'divider',
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
          <Typography fontWeight={700} sx={{ lineHeight: 1.3 }}>{item.productName}</Typography>
          <IconButton
            size="small"
            disabled={loading}
            onClick={() => onRemove(item.cartItemId)}
            sx={{ color: 'text.secondary', flexShrink: 0, '&:hover': { color: 'error.main' } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {item.formattedUnitPrice} each
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          {isLowStock ? (
            <Chip label={`Low Stock · Only ${item.stockQty} left`} size="small"
              sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
          ) : (
            <Chip label="In Stock" size="small"
              sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
          )}
          <Typography variant="caption" color="text.secondary">Ships in 2-3 days</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            border: '1px solid', borderColor: 'divider', borderRadius: 2,
          }}>
            <IconButton
              size="small"
              disabled={item.quantity <= 1 || loading}
              onClick={() => onUpdate(item.cartItemId, item.quantity - 1)}
              sx={{ borderRadius: 0, width: 34, height: 34 }}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Typography sx={{ px: 2, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              disabled={loading}
              onClick={() => onUpdate(item.cartItemId, item.quantity + 1)}
              sx={{ borderRadius: 0, width: 34, height: 34 }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography fontWeight={800} sx={{ fontSize: '1.1rem' }}>{item.formattedLineTotal}</Typography>
            {item.quantity > 1 && (
              <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {item.formattedUnitPrice}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CartSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton height={40} width={200} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2.5, py: 3, borderBottom: i < 3 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: 2.5, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={22} sx={{ mb: 0.8 }} />
                <Skeleton width="30%" height={16} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={16} />
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function CartScreen() {
  const navigate                    = useNavigate();
  const { cart, loading, mutating, error, updateQty, removeItem, dismissError } = useCart();
  const [promoCode, setPromoCode]   = useState('');

  if (!authService.isAuthenticated()) {
    navigate('/auth/login');
    return null;
  }

  if (loading) return <CartSkeleton />;

  const items   = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <AppBreadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping Cart' }]} />

        <Typography variant="h4" fontWeight={900} sx={{ mb: 3, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Shopping Cart
        </Typography>

        {error && (
          <Alert severity="error" onClose={dismissError} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        )}

        {isEmpty ? (
          <Box sx={{
            textAlign: 'center', py: 12, bgcolor: 'background.paper',
            borderRadius: 3, border: '1px solid', borderColor: 'divider',
          }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 72, color: 'text.secondary', mb: 2, opacity: 0.35 }} />
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Your cart is empty</Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 320, mx: 'auto' }}>
              Add some beautiful flowers to get started!
            </Typography>
            <AppButton
              onClick={() => navigate('/shop')}
              sx={{ bgcolor: '#E85D8E', color: '#fff', borderRadius: 50, px: 5, '&:hover': { bgcolor: '#C94375' } }}
            >
              Browse Flowers
            </AppButton>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', px: 3 }}>
                {items.map((item, i) => (
                  <Box key={item.cartItemId}>
                    <CartItemRow item={item} onUpdate={updateQty} onRemove={removeItem} loading={mutating} />
                    {i < items.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <OrderSummary cart={cart} promoCode={promoCode} onPromoChange={setPromoCode} onPromoApply={() => {}} />

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <AppButton
                  fullWidth
                  size="large"
                  disabled={mutating}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/checkout')}
                  sx={{
                    bgcolor: '#E85D8E', color: '#fff', fontWeight: 700,
                    fontSize: '1rem', py: 1.6, borderRadius: 2,
                    '&:hover': { bgcolor: '#C94375' },
                  }}
                >
                  Proceed to Checkout
                </AppButton>

                <AppButton
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/shop')}
                  sx={{
                    borderColor: 'divider', color: 'text.primary', borderRadius: 2,
                    fontWeight: 600, '&:hover': { borderColor: '#E85D8E', color: '#E85D8E' },
                  }}
                >
                  Continue Shopping
                </AppButton>
              </Box>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', py: 4 }}>
          <Grid container spacing={2}>
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    bgcolor: '#fce4ec', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', mx: 'auto', mb: 1.5,
                  }}>
                    <Icon sx={{ color: '#E85D8E', fontSize: 26 }} />
                  </Box>
                  <Typography variant="body2" fontWeight={700}>{label}</Typography>
                  <Typography variant="caption" color="text.secondary">{sub}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
