import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../../core/context/ThemeModeContext';
import AppTextField from '../common/AppTextField';

const navLinks = [
  { label: 'Shop All', to: '/shop' },
  { label: 'Occasions', to: '/occasions' },
  { label: 'Bouquets', to: '/bouquets' },
  { label: 'Plants', to: '/plants' },
  { label: 'Gifts', to: '/gifts' },
];

export default function CustomerTopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleTheme, isDark } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            textAlign: 'center',
            py: 0.7,
            fontSize: '0.78rem',
            color: 'primary.contrastText',
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          Free same-day delivery on orders over $75 · Fresh flowers guaranteed
        </Box>

        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 1, minHeight: '64px !important' }}>
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalFloristIcon sx={{ color: 'primary.contrastText', fontSize: 18 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={800}>
                Flower Cart
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, ml: 3 }}>
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Button
                    key={link.to}
                    onClick={() => navigate(link.to)}
                    variant="text"
                    size="small"
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.main' : 'text.primary',
                      px: 1.5,
                      minHeight: 36,
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ flex: 1 }} />

            {searchOpen ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, width: 240 }}>
                <AppTextField
                  placeholder="Search flowers..."
                  size="small"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  }
                />
              </Box>
            ) : (
              <Tooltip title="Search">
                <IconButton
                  size="small"
                  onClick={() => setSearchOpen(true)}
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
              <IconButton size="small" onClick={toggleTheme}>
                {isDark
                  ? <LightModeOutlinedIcon fontSize="small" />
                  : <DarkModeOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Wishlist">
              <IconButton size="small" onClick={() => navigate('/wishlist')}>
                <Badge badgeContent={0} color="primary" showZero={false}>
                  <FavoriteBorderIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart">
              <IconButton size="small" onClick={() => navigate('/cart')}>
                <Badge badgeContent={2} color="primary">
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton size="small" onClick={() => navigate('/account')}>
                <PersonOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              size="small"
              sx={{ display: { xs: 'flex', md: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 260 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
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
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <List dense>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.to}
              selected={location.pathname.startsWith(link.to)}
              onClick={() => { navigate(link.to); setMobileOpen(false); }}
            >
              <ListItemText
                primary={link.label}
                slotProps={{ primary: { fontSize: '0.9rem', fontWeight: 500 } }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
