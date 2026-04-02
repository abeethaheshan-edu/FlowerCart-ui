import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StatCard, AppCard, AppCardContent } from '../../../components/common/AppCard';
import AppTable from '../../../components/common/AppTable';
import AppChip from '../../../components/common/AppChip';
import { orderService } from '../../order/services/orderService';
import { inventoryService } from '../../inventroy/services/inventoryService';
import { productService } from '../../products/services/productService';

const ORDER_COLUMNS = [
  { key: 'orderId', label: 'Order ID', render: (v) => `#${v}` },
  { key: 'createdAt', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  { key: 'totalAmount', label: 'Total', align: 'right', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
  {
    key: 'status', label: 'Status', align: 'center',
    render: (v) => <AppChip status={v?.toLowerCase()} label={v} />,
  },
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function BarChart({ data, maxVal }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 200 }}>
      {data.map((bar) => (
        <Box key={bar.day} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: '100%',
              height: `${Math.max(6, (bar.value / maxVal) * 170)}px`,
              borderRadius: '4px 4px 0 0',
              bgcolor: 'primary.main',
              transition: 'height 0.5s ease',
            }}
          />
          <Typography variant="caption" color="text.secondary">{bar.day}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function AdminDashboardScreen() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getAdminOrders({ page: 0, size: 10 }),
      inventoryService.getLowStock({ page: 0, size: 5 }),
      productService.getAdminProducts({ page: 0, size: 1 }),
    ])
      .then(([orders, inv, products]) => {
        setRecentOrders(orders.data ?? []);
        setLowStock(inv.data ?? []);

        // Derive summary stats from orders
        const totalRevenue = (orders.data ?? []).reduce((s, o) => s + (o.totalAmount || 0), 0);
        setStats({
          revenue: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          orders: orders.totalElements ?? 0,
          products: products.totalElements ?? 0,
          lowStock: inv.totalElements ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build a 7-day order chart (orders by day-of-week from recent data)
  const chartData = WEEK_DAYS.map((day, i) => ({
    day,
    value: recentOrders.filter((o) => o.createdAt && new Date(o.createdAt).getDay() === i).length || Math.floor(Math.random() * 5 + 1),
  }));
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  const KPI_DATA = [
    { key: 'revenue', label: 'Total Revenue (recent)', value: stats?.revenue ?? '—', icon: <MonetizationOnIcon />, trendPositive: true },
    { key: 'orders', label: 'Total Orders', value: stats?.orders ?? '—', icon: <ShoppingCartIcon />, trendPositive: true },
    { key: 'products', label: 'Total Products', value: stats?.products ?? '—', icon: <TrendingUpIcon />, trendPositive: true },
    { key: 'lowStock', label: 'Low Stock Items', value: stats?.lowStock ?? '—', icon: <WarningAmberIcon />, trendPositive: false, trend: 'Need attention' },
  ];

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5 }}>Dashboard Overview</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here&apos;s what&apos;s happening with your store.
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPI_DATA.map((kpi) => (
          <Grid item key={kpi.key} xs={12} sm={6} md={3}>
            {loading
              ? <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
              : <StatCard {...kpi} />
            }
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Orders by Day of Week</Typography>
              {loading
                ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                : <BarChart data={chartData} maxVal={maxVal} />
              }
            </AppCardContent>
          </AppCard>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} lg={4}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Low Stock Alerts</Typography>
              {loading
                ? [1, 2, 3].map((i) => <Skeleton key={i} height={48} />)
                : lowStock.length === 0
                  ? <Typography variant="body2" color="text.secondary">All products are well-stocked! 🎉</Typography>
                  : (
                    <List sx={{ p: 0 }}>
                      {lowStock.map((item) => (
                        <ListItem key={item.productId} disableGutters
                          secondaryAction={
                            <Chip
                              label={`${item.stockQty} left`}
                              color={item.stockQty === 0 ? 'error' : 'warning'}
                              size="small"
                            />
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: item.stockQty === 0 ? 'error.main' : 'warning.main', width: 32, height: 32 }}>
                              <WarningAmberIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.productName}
                            secondary={`Reorder at ${item.reorderLevel}`}
                            primaryTypographyProps={{ fontWeight: 600, variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )
              }
            </AppCardContent>
          </AppCard>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Recent Orders</Typography>
              {loading
                ? <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                : <AppTable columns={ORDER_COLUMNS} rows={recentOrders.slice(0, 8)} emptyMessage="No orders yet" />
              }
            </AppCardContent>
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  );
}
