import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppCard, { StatCard } from '../../../components/common/AppCard';
import AppChart from '../../../components/common/AppCard'; // optional placeholder, reuse AppCard if no chart component exists
import AppSelect from '../../../components/common/AppSelect';
import AppTable from '../../../components/common/AppTable';
import PageHeader from '../../../components/common/PageHeader';
import AppPagination from '../../../components/common/AppPagination';

const statusOptions = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' },
];

const orderStatusRows = [
  { status: 'Delivered', value: '8,429', percent: '65.6%' },
  { status: 'Processing', value: '2,147', percent: '16.7%' },
  { status: 'Shipped', value: '1,523', percent: '11.9%' },
  { status: 'Cancelled', value: '748', percent: '5.8%' },
];

const productRows = [
  { rank: 1, name: 'Wireless Bluetooth Headphones', units: '2,847', revenue: '$256K', trend: '+23%' },
  { rank: 2, name: 'Smart Fitness Tracker', units: '1,923', revenue: '$189K', trend: '+18%' },
  { rank: 3, name: 'Organic Cotton T-Shirt', units: '1,647', revenue: '$41K', trend: '+12%' },
  { rank: 4, name: 'Premium Coffee Beans', units: '1,234', revenue: '$37K', trend: '+5%' },
  { rank: 5, name: 'Yoga Mat Pro', units: '987', revenue: '$29K', trend: '-2%' },
];

export default function AdminAnalyticsScreen() {
  const [period, setPeriod] = useState('30');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const metrics = useMemo(() => ({
    revenue: '$847K',
    orders: '12,847',
    customers: '8,429',
    conversion: '3.2%',
  }), []);

  const tableCols = [
    { key: 'rank', label: '#' },
    { key: 'name', label: 'Top Products', render: (_, row) => row.name },
    { key: 'units', label: 'Units Sold', align: 'right' },
    { key: 'revenue', label: 'Revenue', align: 'right' },
    { key: 'trend', label: 'Trend', align: 'right' },
  ];

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return productRows.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Analytics' }]} />

      <PageHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive insights and performance metrics"
        action={
          <AppSelect
            label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={statusOptions}
            sx={{ minWidth: 140 }}
          />
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2 }}>
        <StatCard value={metrics.revenue} label="Total Revenue" subtitle="23.5% vs last month" />
        <StatCard value={metrics.orders} label="Total Orders" subtitle="15.2% vs last month" />
        <StatCard value={metrics.customers} label="New Customers" subtitle="18.7% vs last month" />
        <StatCard value={metrics.conversion} label="Conversion Rate" subtitle="0.3% vs last month" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1.1fr' }, gap: 1.5, mb: 2 }}>
        <AppCard title="Revenue Trend">
          <Box sx={{ minHeight: 212, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Chart placeholder</Typography>
          </Box>
        </AppCard>

        <AppCard title="Order Status Distribution">
          <AppTable
            columns={[
              { key: 'status', label: 'Status' },
              { key: 'value', label: 'Count', align: 'right' },
              { key: 'percent', label: '%', align: 'right' },
            ]}
            rows={orderStatusRows}
            emptyMessage="No data"
          />
        </AppCard>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 1.5 }}>
        <AppCard title="Top Products">
          <AppTable columns={tableCols} rows={pagedProducts} emptyMessage="No products" />
          <AppPagination
            page={page}
            count={Math.ceil(productRows.length / rowsPerPage)}
            total={productRows.length}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(x) => {
              setRowsPerPage(x);
              setPage(1);
            }}
          />
        </AppCard>

        <AppCard title="Performance Metrics">
          <Stack spacing={1.25}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Average Order Value</Typography>
              <Typography fontWeight={700}>$67.84</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Customer Lifetime</Typography>
              <Typography fontWeight={700}>$428.92</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Cart Abandonment</Typography>
              <Typography fontWeight={700}>68.4%</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Return Rate</Typography>
              <Typography fontWeight={700}>3.2%</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Customer Sat.</Typography>
              <Typography fontWeight={700}>4.8/5</Typography>
            </Box>
          </Stack>
        </AppCard>
      </Box>
    </Box>
  );
}
