import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = {
  Shop: [
    { label: 'All Flowers', to: '/shop' },
    { label: 'Bouquets', to: '/bouquets' },
    { label: 'Plants', to: '/plants' },
    { label: 'Gifts', to: '/gifts' },
  ],
  Help: [
    { label: 'FAQ', to: '/faq' },
    { label: 'Delivery Info', to: '/delivery' },
    { label: 'Returns', to: '/returns' },
    { label: 'Contact Us', to: '/contact' },
  ],
  Account: [
    { label: 'My Account', to: '/account' },
    { label: 'Orders', to: '/account/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Track Order', to: '/account/orders' },
  ],
};

export default function CustomerFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalFloristIcon sx={{ color: 'primary.contrastText', fontSize: 16 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={800}>
                Flower Cart
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, lineHeight: 1.7 }}>
              Handcrafted floral arrangements delivered fresh to your door. Each bouquet tells a story
              of love, celebration, and natural beauty.
            </Typography>
          </Grid>

          {Object.entries(footerLinks).map(([section, links]) => (
            <Grid key={section} size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {section}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    variant="body2"
                    color="text.secondary"
                    underline="hover"
                    sx={{ '&:hover': { color: 'primary.main' } }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © {new Date().getFullYear()} FlowerCart. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
