import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import flowerBouquet from '../../assets/flower-bouquet.png';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          minHeight: { xs: 'auto', md: 580 },
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(232,93,142,0.12)',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '42%',
            flexShrink: 0,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #FCF0F5 0%, #F8E0EC 60%, #F5D0E5 100%)',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              opacity: 0.15,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              opacity: 0.1,
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2.5,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 18 }}>🌸</Typography>
            </Box>
            <Typography variant="h6" fontWeight={800} color="primary.dark">
              FlowerCart
            </Typography>
          </Box>

          <Box
            component="img"
            src={flowerBouquet}
            alt="Fresh flowers"
            sx={{
              width: 260,
              height: 260,
              objectFit: 'contain',
              filter: 'drop-shadow(0 16px 40px rgba(232,93,142,0.25))',
              mb: 3,
            }}
          />

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              textAlign: 'center',
              color: 'text.primary',
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            Welcome back to your flower gifting experience
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: 280, lineHeight: 1.7 }}
          >
            Sign in to explore our curated collection of premium flowers and create memorable moments.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, sm: 5 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
