import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BarChartIcon from '@mui/icons-material/BarChart';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, to: '/admin' },
  { label: 'Products', icon: <Inventory2Icon fontSize="small" />, to: '/admin/products' },
  { label: 'Orders', icon: <ShoppingCartIcon fontSize="small" />, to: '/admin/orders' },
  { label: 'Customers', icon: <PeopleIcon fontSize="small" />, to: '/admin/customers' },
  { label: 'Inventory', icon: <WarehouseIcon fontSize="small" />, to: '/admin/inventory' },
  { label: 'Analytics', icon: <BarChartIcon fontSize="small" />, to: '/admin/analytics' },
  { label: 'Support', icon: <SupportAgentIcon fontSize="small" />, to: '/admin/support' },
];

const bottomItems = [
  { label: 'Settings', icon: <SettingsIcon fontSize="small" />, to: '/admin/settings' },
  { label: 'Logout', icon: <LogoutIcon fontSize="small" />, to: '/auth/login' },
];

function NavItem({ item, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive =
    item.to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.to);

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
      <ListItemButton
        onClick={() => navigate(item.to)}
        selected={isActive}
        sx={{
          mx: 1,
          mb: 0.3,
          minHeight: 42,
          justifyContent: collapsed ? 'center' : 'flex-start',
          px: collapsed ? 1 : 1.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 0 : 34,
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: { fontSize: '0.88rem', fontWeight: isActive ? 700 : 500 },
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
}

function SidebarContent({ collapsed }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1 : 2.5,
          py: 2.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LocalFloristIcon sx={{ color: 'primary.contrastText', fontSize: 18 }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>
              FlowerCart
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Dashboard
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      <List dense sx={{ flex: 1, py: 0 }}>
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </List>

      <Divider sx={{ mx: 2, mt: 1 }} />

      <List dense sx={{ py: 1 }}>
        {bottomItems.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </List>
    </Box>
  );
}

export default function AdminSidebar({ open, onClose, collapsed, isMobile }) {
  const drawerSx = {
    '& .MuiDrawer-paper': {
      width: isMobile ? DRAWER_WIDTH : collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
      boxSizing: 'border-box',
      border: 'none',
      borderRight: '1px solid',
      borderColor: 'divider',
      transition: 'width 0.2s ease',
      overflowX: 'hidden',
    },
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
      >
        <SidebarContent collapsed={false} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        ...drawerSx,
      }}
    >
      <SidebarContent collapsed={collapsed} />
    </Drawer>
  );
}
