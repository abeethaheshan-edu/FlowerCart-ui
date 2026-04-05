import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import AppButton from '../../../components/common/AppButton';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import CheckoutStepper from '../components/CheckoutStepper';
import OrderSummary from '../components/OrderSummary';
import { cartService } from '../services/cartService';
import { paymentService } from '../services/paymentService';
import { authService } from '../../auth/services/authService';
import { CartModel } from '../../order/models/OrderModels';
import bannerImg from '../../../assets/flower-bouquet.png';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '');

const STRIPE_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      color: '#2E2A2B',
      fontFamily: "'Inter', Arial, sans-serif",
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#E35D6A' },
  },
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

function FieldLabel({ text, required }) {
  return (
    <Typography variant="caption" fontWeight={600}
      sx={{ display: 'block', mb: 0.6, color: 'text.secondary' }}>
      {text}{required && <span style={{ color: '#E85D8E' }}> *</span>}
    </Typography>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <Typography variant="caption" color="error" sx={{ mt: 0.4, display: 'block' }}>
      {message}
    </Typography>
  );
}

function InputField({ control, name, rules, label, placeholder, type = 'text', multiline, rows }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Box>
          <FieldLabel text={label} required={!!rules?.required} />
          <TextField
            {...field}
            type={type}
            placeholder={placeholder}
            fullWidth
            size="small"
            multiline={multiline}
            rows={rows}
            error={!!fieldState.error}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } }}
          />
          <FieldError message={fieldState.error?.message} />
        </Box>
      )}
    />
  );
}

function SelectField({ control, name, rules, label, options, placeholder }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Box>
          <FieldLabel text={label} required={!!rules?.required} />
          <TextField
            {...field}
            select
            fullWidth
            size="small"
            error={!!fieldState.error}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } }}
          >
            {placeholder && <MenuItem value="" disabled>{placeholder}</MenuItem>}
            {options.map((opt) => (
              <MenuItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                {typeof opt === 'string' ? opt : opt.label}
              </MenuItem>
            ))}
          </TextField>
          <FieldError message={fieldState.error?.message} />
        </Box>
      )}
    />
  );
}

// ─── Reusable Stripe Element wrapper (mimics MUI TextField look) ──────────────
function StripeField({ label, required, children, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <Box>
      <FieldLabel text={label} required={required} />
      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : focused ? '#E85D8E' : 'divider',
          borderRadius: 2,
          px: 1.5,
          py: '8.5px',
          bgcolor: 'background.paper',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(232,93,142,0.12)' : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </Box>
      <FieldError message={error} />
    </Box>
  );
}

function ShippingStep({ defaultEmail, onNext, onBackToCart }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '', lastName: '', email: defaultEmail ?? '',
      phone: '', street: '', city: '', state: '', postalCode: '', saveAddress: false,
    },
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}
        sx={{ mb: 0.5, fontFamily: "'Playfair Display', Georgia, serif" }}>
        Shipping Address
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Where should we deliver your flowers?
      </Typography>

      <Stack spacing={2.5}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputField control={control} name="firstName" label="First Name" placeholder="John"
              rules={{ required: 'First name is required' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField control={control} name="lastName" label="Last Name" placeholder="Doe"
              rules={{ required: 'Last name is required' }} />
          </Grid>
        </Grid>

        <InputField control={control} name="email" label="Email Address"
          placeholder="john.doe@example.com" type="email"
          rules={{
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          }}
        />

        <InputField control={control} name="phone" label="Phone Number"
          placeholder="+1 (555) 123-4567"
          rules={{ required: 'Phone number is required' }}
        />

        <InputField control={control} name="street" label="Street Address"
          placeholder="123 Main Street"
          rules={{ required: 'Street address is required' }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputField control={control} name="city" label="City" placeholder="New York"
              rules={{ required: 'City is required' }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectField control={control} name="state" label="State"
              placeholder="Select State" options={US_STATES}
              rules={{ required: 'State is required' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField control={control} name="postalCode" label="ZIP Code" placeholder="10001"
              rules={{
                required: 'ZIP is required',
                pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP code' },
              }}
            />
          </Grid>
        </Grid>

        <Controller name="saveAddress" control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} size="small" sx={{ '&.Mui-checked': { color: '#E85D8E' } }} />}
              label={<Typography variant="body2">Save this address for future orders</Typography>}
            />
          )}
        />
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <AppButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBackToCart}
          sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
        >
          Back to Cart
        </AppButton>
        <AppButton
          endIcon={<ArrowForwardIcon />}
          onClick={handleSubmit(onNext)}
          sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#C94375' } }}
        >
          Continue to Payment
        </AppButton>
      </Box>
    </Box>
  );
}

function PaymentStepInner({ address, cart, onSuccess, onBack }) {
  const stripe   = useStripe();
  const elements = useElements();

  const { control, handleSubmit } = useForm({
    defaultValues: { cardName: `${address.firstName} ${address.lastName}` },
  });

  const [processing, setProcessing] = useState(false);

  // Per-field Stripe errors
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvcError,    setCardCvcError]    = useState('');

  // Track whether each Stripe field has been touched (for validation on submit)
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete,    setCardCvcComplete]    = useState(false);

  const [submitError, setSubmitError] = useState('');

  const handlePay = handleSubmit(async ({ cardName }) => {
    if (!stripe || !elements) return;

    // Validate Stripe fields are complete before submitting
    let hasStripeError = false;
    if (!cardNumberComplete) { setCardNumberError('Card number is required'); hasStripeError = true; }
    if (!cardExpiryComplete) { setCardExpiryError('Expiry date is required'); hasStripeError = true; }
    if (!cardCvcComplete)    { setCardCvcError('CVC is required');            hasStripeError = true; }
    if (hasStripeError) return;

    setProcessing(true);
    setSubmitError('');

    try {
      const order = await paymentService.placeOrder({
        line1:         address.street,
        city:          address.city,
        postalCode:    address.postalCode,
        country:       'US',
        recipientName: `${address.firstName} ${address.lastName}`,
        phone:         address.phone,
        saveAddress:   address.saveAddress,
      });

      const intentData = await paymentService.createPaymentIntent(order.orderId);

      const cardNumberEl = elements.getElement(CardNumberElement);

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardNumberEl,
            billing_details: { name: cardName, email: address.email },
          },
        }
      );

      if (stripeErr) { setSubmitError(stripeErr.message); return; }
      if (paymentIntent?.status === 'succeeded') onSuccess(order);
    } catch (err) {
      setSubmitError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  });

  const tax      = cart ? cart.subtotal * 0.08 : 0;
  const shipping = cart && cart.subtotal >= 75 ? 0 : 5.99;
  const total    = cart ? cart.subtotal + shipping + tax : 0;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800}
        sx={{ mb: 0.5, fontFamily: "'Playfair Display', Georgia, serif" }}>
        Payment Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your payment is encrypted and secure.
      </Typography>

      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1, mb: 3,
        bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, px: 2, py: 1.2,
      }}>
        <SecurityOutlinedIcon sx={{ fontSize: 15, color: '#16a34a' }} />
        <Typography variant="caption" fontWeight={600} sx={{ color: '#15803d' }}>
          Secure Checkout — Powered by Stripe
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {/* Name on Card — react-hook-form field */}
        <InputField
          control={control}
          name="cardName"
          label="Name on Card"
          placeholder="John Doe"
          rules={{ required: 'Name on card is required' }}
        />

        {/* Card Number — Stripe Element */}
        <StripeField label="Card Number" required error={cardNumberError}>
          <CardNumberElement
            options={{ ...STRIPE_ELEMENT_STYLE, placeholder: '1234 1234 1234 1234', showIcon: true }}
            onChange={(e) => {
              setCardNumberComplete(e.complete);
              setCardNumberError(e.error?.message ?? '');
            }}
          />
        </StripeField>

        {/* Expiry + CVC side by side */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <StripeField label="Expiry Date" required error={cardExpiryError}>
              <CardExpiryElement
                options={{ ...STRIPE_ELEMENT_STYLE, placeholder: 'MM / YY' }}
                onChange={(e) => {
                  setCardExpiryComplete(e.complete);
                  setCardExpiryError(e.error?.message ?? '');
                }}
              />
            </StripeField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StripeField label="CVC" required error={cardCvcError}>
              <CardCvcElement
                options={{ ...STRIPE_ELEMENT_STYLE, placeholder: '123' }}
                onChange={(e) => {
                  setCardCvcComplete(e.complete);
                  setCardCvcError(e.error?.message ?? '');
                }}
              />
            </StripeField>
          </Grid>
        </Grid>

        {/* General submit error */}
        {submitError && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{submitError}</Alert>
        )}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <AppButton
          variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}
          sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
        >
          Back
        </AppButton>
        <AppButton
          loading={processing}
          disabled={!stripe}
          endIcon={!processing && <ArrowForwardIcon />}
          onClick={handlePay}
          sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#C94375' } }}
        >
          {processing ? 'Processing…' : `Pay $${total.toFixed(2)}`}
        </AppButton>
      </Box>
    </Box>
  );
}

function PaymentStep(props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStepInner {...props} />
    </Elements>
  );
}

function ReviewStep({ address, cart, onBack, onEdit }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800}
        sx={{ mb: 0.5, fontFamily: "'Playfair Display', Georgia, serif" }}>
        Review Your Order
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please confirm the details before placing your order.
      </Typography>

      <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.07em', color: 'text.secondary' }}>
            Delivering to
          </Typography>
          <Box onClick={onEdit} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: 'primary.main' }}>
            <EditOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600} color="primary.main">Edit</Typography>
          </Box>
        </Box>
        <Typography variant="body2" fontWeight={700}>{address.firstName} {address.lastName}</Typography>
        <Typography variant="body2" color="text.secondary">{address.street}</Typography>
        <Typography variant="body2" color="text.secondary">{address.city}, {address.state} {address.postalCode}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{address.email} · {address.phone}</Typography>
      </Box>

      <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
        <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.07em', color: 'text.secondary', mb: 1.5 }}>
          Items ({cart?.itemCount ?? 0})
        </Typography>
        {(cart?.items ?? []).map((item) => (
          <Box key={item.cartItemId} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
            <Typography variant="body2">{item.productName} <span style={{ color: '#9ca3af' }}>× {item.quantity}</span></Typography>
            <Typography variant="body2" fontWeight={700}>{item.formattedLineTotal}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <AppButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}
          sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}>
          Back
        </AppButton>
      </Box>
    </Box>
  );
}

function ConfirmStep({ order }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Box sx={{ width: 88, height: 88, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 50, color: '#2e7d32' }} />
      </Box>

      <Typography variant="h4" fontWeight={900} sx={{ mb: 1, fontFamily: "'Playfair Display', Georgia, serif" }}>
        Order Placed! 🎉
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Thank you! A confirmation email has been sent to you.
      </Typography>
      {order && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Order #{order.orderId} · {order.formattedTotal}
        </Typography>
      )}

      <Box sx={{ bgcolor: '#fdf2f6', border: '1px solid #fce4ec', borderRadius: 2, px: 3, py: 2, mb: 4, maxWidth: 380, mx: 'auto' }}>
        <LocalFloristIcon sx={{ color: '#E85D8E', mb: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Your flowers will be fresh-cut and delivered within 3-5 business days.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <AppButton
          onClick={() => navigate('/account/orders')}
          sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 4, borderRadius: 50, '&:hover': { bgcolor: '#C94375' } }}
        >
          View My Orders
        </AppButton>
        <AppButton
          variant="outlined"
          onClick={() => navigate('/shop')}
          sx={{ borderColor: '#E85D8E', color: '#E85D8E', fontWeight: 600, px: 4, borderRadius: 50 }}
        >
          Continue Shopping
        </AppButton>
      </Box>
    </Box>
  );
}

export default function CheckoutScreen() {
  const navigate                            = useNavigate();
  const [step, setStep]                     = useState(0);
  const [cart, setCart]                     = useState(null);
  const [cartLoading, setCartLoading]       = useState(true);
  const [address, setAddress]               = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    cartService.getCart()
      .then(setCart)
      .catch(() => {})
      .finally(() => setCartLoading(false));
  }, [navigate]);

  const handleShippingNext   = (data)  => { setAddress(data); setStep(1); };
  const handlePaymentSuccess = (order) => { setConfirmedOrder(order); setStep(3); };

  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton height={40} width={220} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Box sx={{
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: 'background.paper', py: 1.5, px: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFloristIcon sx={{ color: '#E85D8E', fontSize: 22 }} />
          <Typography fontWeight={900} sx={{ color: '#E85D8E' }}>FlowerCart</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <SecurityOutlinedIcon sx={{ fontSize: 14, color: '#16a34a' }} />
          <Typography variant="caption" fontWeight={700} sx={{ color: '#15803d' }}>Secure Checkout</Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <AppBreadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

        {step < 3 && <CheckoutStepper activeStep={step} />}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: { xs: 2.5, md: 4 } }}>
              {step === 0 && (
                <ShippingStep
                  defaultEmail={authService.getStoredUser()?.email ?? ''}
                  onNext={handleShippingNext}
                  onBackToCart={() => navigate('/cart')}
                />
              )}
              {step === 1 && (
                <PaymentStep
                  address={address}
                  cart={cart}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && (
                <ReviewStep
                  address={address}
                  cart={cart}
                  onBack={() => setStep(1)}
                  onEdit={() => setStep(0)}
                />
              )}
              {step === 3 && <ConfirmStep order={confirmedOrder} />}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            {step < 3 && cart && (
              <Box sx={{ position: { md: 'sticky' }, top: 80 }}>
                <OrderSummary cart={cart} showItems />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}