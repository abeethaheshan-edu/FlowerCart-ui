import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import AppButton from '../../../components/common/AppButton';
import { authService } from '../../auth/services/authService';
import { orderService } from '../../order/services/orderService';

const MENU_ITEMS = [
  { icon: ShoppingBagOutlinedIcon, label: 'My Orders',       sub: 'View and track your orders',      to: '/account/orders' },
  { icon: FavoriteBorderIcon,      label: 'My Wishlist',     sub: 'Your saved flower arrangements',  to: '/wishlist' },
  { icon: LocationOnOutlinedIcon,  label: 'My Addresses',    sub: 'Manage delivery addresses',       to: '/account' },
  { icon: PersonOutlineIcon,       label: 'Account Settings', sub: 'Update your profile details',   to: '/account' },
];

export default function AccountDashboardScreen() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    const stored = authService.getStoredUser();
    setUser(stored);

    orderService.getMyOrders({ page: 0, size: 3 })
      .then((paged) => setOrders(paged.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    //await authService.logout();
    window.localStorage.clear();
    navigate('/auth/login');
  };

  const statusColor = (s) => {
    const map = { DELIVERED: 'success', SHIPPED: 'info', PROCESSING: 'warning', PENDING: 'default', CANCELLED: 'error' };
    return map[s] ?? 'default';
  };

  return (
    <Box sx={{ bgcolor: '#FDF6F9', minHeight: '70vh', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        {/* Profile header */}
        <Box sx={{
          bgcolor: 'background.paper', borderRadius: 4,
          border: '1px solid', borderColor: 'divider',
          p: { xs: 2.5, md: 3.5 }, mb: 3,
          display: 'flex', alignItems: 'center', gap: 2.5,
          flexWrap: 'wrap',
        }}>
          <Avatar
            sx={{ width: 68, height: 68, bgcolor: '#E85D8E', fontSize: '1.6rem', fontWeight: 700 }}
          >
            {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.3 }}>
              {user?.fullName ?? 'Welcome back!'}
            </Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          </Box>
          <AppButton
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 50, '&:hover': { borderColor: '#E85D8E', color: '#E85D8E' } }}
          >
            Sign Out
          </AppButton>
        </Box>

        {/* Menu cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} key={item.label}>
                <Box
                  onClick={() => navigate(item.to)}
                  sx={{
                    bgcolor: 'background.paper', borderRadius: 3,
                    border: '1px solid', borderColor: 'divider',
                    p: 2.5, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 2,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#E85D8E', boxShadow: '0 6px 20px rgba(232,93,142,0.12)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon sx={{ color: '#E85D8E', fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} sx={{ mb: 0.2 }}>{item.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                  </Box>
                  <ArrowForwardIosIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Recent orders */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
            <AppButton variant="text" onClick={() => navigate('/account/orders')} sx={{ color: '#E85D8E', fontWeight: 600, fontSize: '0.83rem' }}>
              View all →
            </AppButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            [1,2,3].map((i) => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)
          ) : orders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No orders yet.</Typography>
              <AppButton onClick={() => navigate('/shop')} sx={{ mt: 1.5, bgcolor: '#E85D8E', color: '#fff', borderRadius: 50, '&:hover': { bgcolor: '#C94375' } }}>
                Start Shopping
              </AppButton>
            </Box>
          ) : (
            orders.map((order) => (
              <Box
                key={order.orderId}
                onClick={() => navigate(`/account/orders/${order.orderId}/track`)}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  py: 1.5, cursor: 'pointer', borderRadius: 2,
                  '&:hover': { bgcolor: 'action.hover' }, px: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={700}>Order #{order.orderId}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}
                    {' · '}{order.orderItems?.length ?? 0} item(s)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography fontWeight={700} sx={{ color: '#E85D8E' }}>{order.formattedTotal}</Typography>
                  <Chip label={order.status} color={statusColor(order.status)} size="small" sx={{ fontSize: '0.7rem' }} />
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
