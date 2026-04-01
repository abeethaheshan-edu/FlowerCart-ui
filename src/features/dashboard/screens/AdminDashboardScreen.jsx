import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StatCard, AppCard, AppCardContent } from '../../../components/common/AppCard';
import AppTable from '../../../components/common/AppTable';

const KPI_DATA = [
  { key: 'revenue', label: 'Total Revenue', value: '$47,832', trend: '+12.5%', trendPositive: true, icon: <MonetizationOnIcon /> },
  { key: 'orders', label: 'Total Orders', value: '1,247', trend: '+8.2%', trendPositive: true, icon: <ShoppingCartIcon /> },
  { key: 'users', label: 'Active Users', value: '8,942', trend: '+15.3%', trendPositive: true, icon: <GroupIcon /> },
  { key: 'conversion', label: 'Conversion Rate', value: '3.8%', trend: '+0.5%', trendPositive: true, icon: <TrendingUpIcon /> },
];

const RECENT_ORDERS = [
  { id: '#ORD-2024-001247', customer: 'Sarah Johnson', total: '$129.99', status: 'Delivered', date: '2 hours ago' },
  { id: '#ORD-2024-001246', customer: 'Mike Chen', total: '$89.99', status: 'Shipped', date: '5 hours ago' },
  { id: '#ORD-2024-001245', customer: 'Emma Davis', total: '$199.99', status: 'Processing', date: '1 day ago' },
];

const LOW_STOCK = [
  { name: 'iPhone 15 Pro Max', level: 'Critical', quantity: 3 },
  { name: 'MacBook Air M2', level: 'Low', quantity: 8 },
  { name: 'AirPods Pro 2', level: 'Low', quantity: 12 },
];

const CUSTOMER_ACTIVITY = [
  { day: 'Mon', value: 1200 },
  { day: 'Tue', value: 1800 },
  { day: 'Wed', value: 1500 },
  { day: 'Thu', value: 2200 },
  { day: 'Fri', value: 1920 },
  { day: 'Sat', value: 2500 },
  { day: 'Sun', value: 1700 },
];

const ORDER_COLUMNS = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

export default function AdminDashboardScreen() {
  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, here&apos;s what&apos;s happening with your store
      </Typography>

      <Grid container spacing={2}>
        {KPI_DATA.map((kpi) => (
          <Grid item key={kpi.key} xs={12} sm={6} md={3}>
            <StatCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={8}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Sales Analytics
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 220 }}>
                {CUSTOMER_ACTIVITY.map((bar) => (
                  <Box
                    key={bar.day}
                    sx={{
                      width: '100%',
                      height: `${Math.max(10, (bar.value / 2600) * 100)}%`,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography variant="caption" color="common.white" sx={{ textAlign: 'center', mb: 0.5 }}>
                      {bar.day}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AppCardContent>
          </AppCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Revenue Breakdown
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <GroupIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Bouquets" secondary="45%" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <ShoppingCartIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Plants" secondary="25%" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <MonetizationOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Gifts" secondary="15%" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <WarningAmberIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Other" secondary="15%" />
                </ListItem>
              </List>
            </AppCardContent>
          </AppCard>
        </Grid>

        <Grid item xs={12} lg={8}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Recent Orders
              </Typography>
              <AppTable columns={ORDER_COLUMNS} rows={RECENT_ORDERS} />
            </AppCardContent>
          </AppCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Low Stock Alerts
              </Typography>
              <List sx={{ p: 0 }}>
                {LOW_STOCK.map((item) => (
                  <ListItem key={item.name} disableGutters>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} units left — ${item.level}`}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItem>
                ))}
              </List>
            </AppCardContent>
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  );
}

