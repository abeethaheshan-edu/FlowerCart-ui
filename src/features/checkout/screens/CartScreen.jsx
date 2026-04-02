import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppButton from '../../../components/common/AppButton';
import PageHeader from '../../../components/common/PageHeader';
import { AppCard, AppCardContent } from '../../../components/common/AppCard';
import bannerImg from '../../../assets/flower-bouquet.png';
import { cartService } from '../services/cartService';
import { authService } from '../../auth/services/authService';

function CartItemRow({ item, onUpdate, onRemove, loading }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 2, alignItems: 'center' }}>
      <Box
        component="img"
        src={item.primaryImageUrl || bannerImg}
        alt={item.productName}
        sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={700} noWrap>{item.productName}</Typography>
        <Typography variant="body2" color="text.secondary">{item.formattedUnitPrice} each</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <IconButton size="small" disabled={item.quantity <= 1 || loading} onClick={() => onUpdate(item.cartItemId, item.quantity - 1)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ px: 1.5, fontWeight: 700, minWidth: 28, textAlign: 'center' }}>
          {item.quantity}
        </Typography>
        <IconButton size="small" disabled={loading} onClick={() => onUpdate(item.cartItemId, item.quantity + 1)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
        {item.formattedLineTotal}
      </Typography>
      <IconButton size="small" color="error" disabled={loading} onClick={() => onRemove(item.cartItemId)}>
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default function CartScreen() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setLoading(true);
    cartService.getCart()
      .then(setCart)
      .catch(() => setError('Failed to load cart. Please try again.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUpdate = async (cartItemId, quantity) => {
    setMutating(true);
    try {
      const updated = await cartService.updateItemQuantity(cartItemId, quantity);
      setCart(updated);
    } catch (err) {
      setError(err.message || 'Could not update quantity.');
    } finally {
      setMutating(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    setMutating(true);
    try {
      const updated = await cartService.removeItem(cartItemId);
      setCart(updated);
    } catch (err) {
      setError(err.message || 'Could not remove item.');
    } finally {
      setMutating(false);
    }
  };

  const handleClear = async () => {
    setMutating(true);
    try {
      await cartService.clearCart();
      setCart({ items: [], subtotal: 0, itemCount: 0, formattedSubtotal: '$0.00' });
    } catch (err) {
      setError(err.message || 'Could not clear cart.');
    } finally {
      setMutating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
        <Skeleton height={40} width={200} />
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, py: 2 }}>
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
            <Box sx={{ flex: 1 }}><Skeleton /><Skeleton width="60%" /></Box>
          </Box>
        ))}
      </Box>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <PageHeader
        title="Shopping Cart"
        subtitle={isEmpty ? 'Your cart is empty' : `${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''} in your cart`}
        action={
          !isEmpty && (
            <AppButton variant="outlined" color="error" size="small" disabled={mutating} onClick={handleClear}>
              Clear Cart
            </AppButton>
          )
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {isEmpty ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" fontWeight={700}>Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary">Add some beautiful flowers to get started!</Typography>
          <AppButton variant="contained" onClick={() => navigate('/shop')}>Browse Flowers</AppButton>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppCard>
              <AppCardContent>
                <Stack divider={<Divider />}>
                  {items.map((item) => (
                    <CartItemRow
                      key={item.cartItemId}
                      item={item}
                      onUpdate={handleUpdate}
                      onRemove={handleRemove}
                      loading={mutating}
                    />
                  ))}
                </Stack>
              </AppCardContent>
            </AppCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <AppCard>
              <AppCardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Order Summary</Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Subtotal ({cart.itemCount} items)</Typography>
                    <Typography fontWeight={600}>{cart.formattedSubtotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography color="success.main" fontWeight={600}>Free</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={800} variant="h6">Total</Typography>
                    <Typography fontWeight={800} variant="h6" color="primary.main">
                      {cart.formattedSubtotal}
                    </Typography>
                  </Box>
                </Stack>
                <AppButton
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </AppButton>
                <AppButton
                  variant="text"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </AppButton>
              </AppCardContent>
            </AppCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
