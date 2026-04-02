import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AppButton from '../../../../components/common/AppButton';
import PageHeader from '../../../../components/common/PageHeader';
import AppChip from '../../../../components/common/AppChip';
import AppPagination from '../../../../components/common/AppPagination';
import { AppCard, AppCardContent } from '../../../../components/common/AppCard';
import { orderService } from '../../services/orderService';
import { authService } from '../../../auth/services/authService';

const PAGE_SIZE = 10;

export default function OrdersScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setLoading(true);
    orderService.getMyOrders({ page: page - 1, size: PAGE_SIZE })
      .then((paged) => {
        setOrders(paged.data ?? []);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load orders. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, navigate]);

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <PageHeader
        title="My Orders"
        subtitle={`${totalElements} order${totalElements !== 1 ? 's' : ''} placed`}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />)}
        </Stack>
      ) : orders.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
          <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" fontWeight={700}>No orders yet</Typography>
          <Typography variant="body2" color="text.secondary">Start shopping to see your orders here.</Typography>
          <AppButton variant="contained" onClick={() => navigate('/shop')}>Browse Flowers</AppButton>
        </Box>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <AppCard key={order.orderId}>
              <AppCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Order #{order.orderId}</Typography>
                    <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : '—'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AppChip status={order.status?.toLowerCase()} label={order.status} />
                    <Typography variant="h6" fontWeight={800} color="primary.main">{order.formattedTotal}</Typography>
                  </Stack>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Items preview */}
                <Stack spacing={0.5}>
                  {(order.orderItems ?? []).slice(0, 3).map((item) => (
                    <Box key={item.orderItemId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.productName} × {item.quantity}
                      </Typography>
                      <Typography variant="body2">{item.formattedLineTotal}</Typography>
                    </Box>
                  ))}
                  {(order.orderItems ?? []).length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{order.orderItems.length - 3} more item(s)
                    </Typography>
                  )}
                </Stack>

                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <AppButton size="small" variant="outlined" onClick={() => navigate(`/account/orders/${order.orderId}/track`)}>
                    Track Order
                  </AppButton>
                </Box>
              </AppCardContent>
            </AppCard>
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <AppPagination
          page={page}
          count={totalPages}
          total={totalElements}
          rowsPerPage={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </Box>
  );
}
