import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const STEPS = [
  { label: 'Shipping', sub: 'Address details' },
  { label: 'Payment',  sub: 'Payment method' },
  { label: 'Review',   sub: 'Order details' },
  { label: 'Confirm',  sub: 'Order placed' },
];

export default function CheckoutStepper({ activeStep }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, px: { xs: 0, md: 4 } }}>
      {STEPS.map((step, i) => (
        <Box key={step.label} sx={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: activeStep === i ? 'primary.main' : activeStep > i ? 'primary.main' : '#e5e7eb',
              color: activeStep >= i ? '#fff' : 'text.secondary',
              fontWeight: 800, fontSize: '0.9rem',
              transition: 'background-color 0.25s',
            }}>
              {i + 1}
            </Box>
            <Typography variant="caption" fontWeight={activeStep === i ? 700 : 500}
              sx={{ mt: 0.6, color: activeStep === i ? 'text.primary' : 'text.secondary', textAlign: 'center', lineHeight: 1.3 }}>
              {step.label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.67rem', textAlign: 'center' }}>
              {step.sub}
            </Typography>
          </Box>

          {i < STEPS.length - 1 && (
            <Box sx={{ flex: 1, height: 2, mt: 2.2, mx: 0.5, bgcolor: activeStep > i ? 'primary.main' : '#e5e7eb', transition: 'background-color 0.25s' }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
