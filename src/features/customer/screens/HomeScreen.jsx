import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AppButton from '../../../components/common/AppButton';
import { ProductCard } from '../../../components/common/AppCard';
import bannerImg from '../../../assets/flower-bouquet.png';

const FEATURE_ENTRIES = [
  { icon: <LocalShippingIcon color="primary" />, label: 'Same-Day Delivery', helper: 'Order by 2 PM' },
  { icon: <LocalFloristIcon color="primary" />, label: 'Fresh Guarantee', helper: '7-day freshness' },
  { icon: <CardGiftcardIcon color="primary" />, label: 'Free Greeting Card', helper: 'Personalized message' },
];

const TRENDING_PRODUCTS = [
  { id: '1', name: 'Roses Bouquet', image: bannerImg, price: '$59.99', originalPrice: '$69.99', badge: '20% OFF' },
  { id: '2', name: 'Sunflower Mix', image: bannerImg, price: '$49.99', originalPrice: '$59.99', badge: 'New' },
  { id: '3', name: 'Orchid Classic', image: bannerImg, price: '$79.99' },
  { id: '4', name: 'Tulip Surprise', image: bannerImg, price: '$39.99', originalPrice: '$44.99' },
];

const TESTIMONIALS = [
  { id: 't1', name: 'Sarah Jenkins', text: 'Beautiful bouquet & fast delivery. I loved the packaging.', stars: 5 },
  { id: 't2', name: 'Michael Chen', text: 'Great flowers and reliable service. Will order again.', stars: 5 },
  { id: 't3', name: 'David Miller', text: 'Best flower shop online. My wife loved it.', stars: 5 },
];

export default function HomeScreen() {
  const testimonials = useMemo(() => TESTIMONIALS, []);

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      {/* Hero */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
          gap: 4,
          alignItems: 'center',
          mb: 6,
        }}
      >
        <Box>
          <Typography variant="overline" color="primary.main" fontWeight={800} sx={{ letterSpacing: 2 }}>
            Fresh Spring Collection 2024
          </Typography>
          <Typography variant="h2" fontWeight={900} sx={{ mt: 1, mb: 2, lineHeight: 1.1 }}>
            Celebrate Every
            <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>
              Beautiful Moment
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 540 }}>
            Handcrafted floral arrangements delivered fresh to your door. Each bouquet tells a story of love, celebration, and natural beauty.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <AppButton size="large" sx={{ px: 4 }}>
              Shop Bouquets
            </AppButton>
            <AppButton size="large" variant="outlined">
              Same-Day Delivery
            </AppButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Avatar sx={{ width: 34, height: 34 }} src="https://i.pravatar.cc/40?img=47" />
            <Typography variant="body2" color="text.secondary">
              4.9/5 from 3,200+ happy customers
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box component="img" src={bannerImg} alt="Spring bouquet" sx={{ width: '100%', maxWidth: 460, borderRadius: 4, boxShadow: 4 }} />
        </Box>
      </Box>

      {/* Feature row */}
      <Grid container spacing={2} mb={6}>
        {FEATURE_ENTRIES.map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Box
              sx={{
                px: 2,
                py: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minHeight: 110,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: 'action.hover' }}>
                {item.icon}
              </Box>
              <Box>
                <Typography fontWeight={800}>{item.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.helper}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Trending products */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" fontWeight={900}>Trending Now</Typography>
          <AppButton size="small" variant="text">View all categories</AppButton>
        </Box>
        <Grid container spacing={2}>
          {TRENDING_PRODUCTS.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={3}>
              <ProductCard
                image={product.image}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                actions={
                  <AppButton size="small" variant="contained" fullWidth>
                    Add to cart
                  </AppButton>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
          What Our Customers Say
        </Typography>
        <Grid container spacing={2}>
          {testimonials.map((t) => (
            <Grid item xs={12} md={4} key={t.id}>
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', minHeight: 210 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 1.5 }}>
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <StarIcon key={idx} sx={{ color: 'warning.main', fontSize: 18 }} />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  “{t.text}”
                </Typography>
                <Typography fontWeight={700}>{t.name}</Typography>
                <Typography variant="caption" color="text.secondary">Verified Buyer</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
