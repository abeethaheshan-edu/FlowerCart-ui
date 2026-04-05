import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import AppButton from '../../../components/common/AppButton';
import bannerImg from '../../../assets/flower-bouquet.png';

function SummaryRow({ label, value, valueColor, isTotal }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant={isTotal ? 'h6' : 'body2'} fontWeight={isTotal ? 800 : 400}
        color={isTotal ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
      <Typography variant={isTotal ? 'h6' : 'body2'} fontWeight={isTotal ? 800 : 600}
        sx={{ color: valueColor ?? 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  );
}

function TrustLine({ icon: Icon, text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
      <Typography variant="caption" color="text.secondary">{text}</Typography>
    </Box>
  );
}

export default function OrderSummary({ cart, showItems = false, promoCode, onPromoChange, onPromoApply }) {
  if (!cart) return null;

  const isFreeShipping = cart.subtotal >= 75;
  const shipping       = isFreeShipping ? 0 : 5.99;
  const tax            = cart.subtotal * 0.08;
  const total          = cart.subtotal + shipping + tax;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2.5 }}>Order Summary</Typography>

      {showItems && cart.items.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {cart.items.map((item) => (
            <Box key={item.cartItemId} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
              <Box
                component="img"
                src={item.primaryImageUrl || bannerImg}
                alt={item.productName}
                sx={{ width: 50, height: 50, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0, border: '1px solid', borderColor: 'divider' }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: '0.82rem' }}>{item.productName}</Typography>
                <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ fontSize: '0.82rem' }}>{item.formattedLineTotal}</Typography>
              </Box>
            </Box>
          ))}
          <Divider sx={{ mb: 2 }} />
        </Box>
      )}

      <Stack spacing={1.2} sx={{ mb: 2 }}>
        <SummaryRow label={`Subtotal (${cart.itemCount} items)`} value={cart.formattedSubtotal} />
        <SummaryRow label="Shipping" value={isFreeShipping ? 'FREE' : '$5.99'} valueColor={isFreeShipping ? 'success.main' : undefined} />
        <SummaryRow label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
        <SummaryRow label="Discount" value="-$0.00" valueColor="primary.main" />
      </Stack>

      {onPromoChange && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.8, color: 'text.secondary' }}>Promo Code</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Enter code"
              value={promoCode ?? ''}
              onChange={(e) => onPromoChange(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <AppButton
              variant="outlined"
              onClick={onPromoApply}
              sx={{ borderColor: 'divider', color: 'text.primary', borderRadius: 2, flexShrink: 0, minWidth: 72 }}
            >
              Apply
            </AppButton>
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />
      <SummaryRow label="Total" value={`$${total.toFixed(2)}`} isTotal />

      <Stack spacing={1} sx={{ mt: 2.5 }}>
        <TrustLine icon={LocalShippingOutlinedIcon} text="Free shipping on orders over $75" />
        <TrustLine icon={SecurityOutlinedIcon}      text="Secure checkout guaranteed" />
        <TrustLine icon={LoopIcon}                  text="Estimated delivery: 3-5 business days" />
      </Stack>
    </Box>
  );
}
