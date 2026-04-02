import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppButton from '../../../../components/common/AppButton';
import AppBreadcrumbs from '../../../../components/common/AppBreadcrumbs';
import AppChip from '../../../../components/common/AppChip';
import { AppCard, AppCardContent } from '../../../../components/common/AppCard';
import bannerImg from '../../../../assets/flower-bouquet.png';
import { orderService } from '../../services/orderService';
import { authService } from '../../../auth/services/authService';

const ORDER_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function stepIndex(status) {
  const i = ORDER_STEPS.indexOf(status);
  return i >= 0 ? i : (status === 'CANCELLED' ? -1 : 0);
}

export default function OrderTrackingScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    if (!id) return;
    setLoading(true);
    orderService.trackOrder(id)
      .then(setOrder)
      .catch(() => setError('Failed to load order tracking. Please try again.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
        <Skeleton height={30} width={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
        <Alert severity="error">{error || 'Order not found.'}</Alert>
        <AppButton startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate('/account/orders')}>
          Back to Orders
        </AppButton>
      </Box>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const currentStep = stepIndex(order.status);

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <AppBreadcrumbs
        items={[
          { label: 'Account', to: '/account' },
          { label: 'My Orders', to: '/account/orders' },
          { label: `Order #${order.orderId}` },
        ]}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Order #{order.orderId}</Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : '—'}
          </Typography>
        </Box>
        <AppChip status={order.status?.toLowerCase()} label={order.status} />
      </Box>

      {/* Tracking stepper */}
      {!isCancelled && (
        <AppCard sx={{ mb: 3 }}>
          <AppCardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Delivery Progress</Typography>
            <Stepper activeStep={currentStep} alternativeLabel>
              {ORDER_STEPS.map((step) => (
                <Step key={step}>
                  <StepLabel>{step.charAt(0) + step.slice(1).toLowerCase()}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </AppCardContent>
        </AppCard>
      )}

      {isCancelled && (
        <Alert severity="error" sx={{ mb: 3 }}>This order has been cancelled.</Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Order Items */}
        <AppCard sx={{ flex: 2 }}>
          <AppCardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Items Ordered</Typography>
            <Stack spacing={2} divider={<Divider />}>
              {(order.orderItems ?? []).map((item) => (
                <Box key={item.orderItemId} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={item.primaryImageUrl || bannerImg}
                    alt={item.productName}
                    sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity} × ${parseFloat(item.unitPrice || 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography fontWeight={700}>{item.formattedLineTotal}</Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${parseFloat(order.subtotal || 0).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>${parseFloat(order.shippingFee || 0).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight={800} variant="h6">Total</Typography>
                <Typography fontWeight={800} variant="h6" color="primary.main">{order.formattedTotal}</Typography>
              </Box>
            </Stack>
          </AppCardContent>
        </AppCard>

        {/* Shipping & Payment */}
        <Stack spacing={2} sx={{ flex: 1 }}>
          {order.shippingAddress && (
            <AppCard>
              <AppCardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Shipping Address</Typography>
                {order.shippingAddress.label && (
                  <Typography variant="body2" fontWeight={600}>{order.shippingAddress.label}</Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.fullAddress}
                </Typography>
              </AppCardContent>
            </AppCard>
          )}
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Payment</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <AppChip status={order.paymentStatus?.toLowerCase()} label={order.paymentStatus || 'Pending'} />
              </Box>
            </AppCardContent>
          </AppCard>
        </Stack>
      </Stack>

      <AppButton startIcon={<ArrowBackIcon />} sx={{ mt: 3 }} onClick={() => navigate('/account/orders')}>
        Back to Orders
      </AppButton>
    </Box>
  );
}
