import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AppAvatar from '../common/AppAvatar';
import { useThemeMode } from '../../core/context/ThemeModeContext';

export default function AdminTopBar({ onMenuToggle, collapsed, isMobile }) {
  const { toggleTheme, isDark } = useThemeMode();

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer - 1 }}>
      <Toolbar sx={{ gap: 1, minHeight: '60px !important' }}>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton onClick={onMenuToggle} size="small" edge="start">
            {!isMobile && collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
            {isMobile && <MenuIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
          <IconButton size="small" onClick={toggleTheme}>
            {isDark
              ? <LightModeOutlinedIcon fontSize="small" />
              : <DarkModeOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <IconButton size="small">
          <Badge badgeContent={3} color="error">
            <NotificationsOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
          <AppAvatar name="John Admin" size={32} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
              John Admin
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
