import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import { analyticsService } from '../services/analyticsService';

const CARD_SX = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px',
};

const STATUS_COLORS = {
  DELIVERED: '#22c55e', CONFIRMED: '#22c55e',
  PROCESSING: '#E85D8E', SHIPPED: '#f59e0b',
  CANCELLED: '#ef4444',  PENDING: '#9ca3af',
};

function fmtMoney(v) {
  const n = Number(v ?? 0);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`;
  return `$${n.toFixed(0)}`;
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value, trend, trendUp }) {
  return (
    <Box sx={{ ...CARD_SX, flex: 1, p: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: '6px' }}>{label}</Typography>
        </Box>
        <Box sx={{
          width: 46, height: 46, borderRadius: '10px',
          bgcolor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon sx={{ fontSize: 22, color: iconColor }} />
        </Box>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '12px' }}>
          {trendUp
            ? <ArrowUpwardIcon sx={{ fontSize: 13, color: 'success.main' }} />
            : <ArrowDownwardIcon sx={{ fontSize: 13, color: 'error.main' }} />}
          <Typography variant="caption" fontWeight={700}
            sx={{ color: trendUp ? 'success.main' : 'error.main' }}>
            {trend}
          </Typography>
          <Typography variant="caption" color="text.secondary">vs last month</Typography>
        </Box>
      )}
    </Box>
  );
}

function RevenueChart({ data = [] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => Number(d.revenue ?? 0)), 1);
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: 135 }}>
        {data.map((pt, i) => {
          const pct = Math.max((Number(pt.revenue ?? 0) / max) * 100, 3);
          return (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <Box sx={{
                width: '100%', bgcolor: '#E85D8E', borderRadius: '3px 3px 0 0',
                height: `${pct}%`, minHeight: 4,
                '&:hover': { bgcolor: '#C94375', cursor: 'pointer' },
              }} />
              <Typography sx={{ fontSize: '9px', color: 'text.secondary', lineHeight: 1 }}>
                {pt.month}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function StatusBar({ label, count, pct, color }) {
  return (
    <Box sx={{ mb: '18px', '&:last-child': { mb: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '5px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color }} />
          <Typography variant="body2">{label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Typography variant="body2" fontWeight={600}>{count.toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 38, textAlign: 'right' }}>
            {pct.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
      <LinearProgress variant="determinate" value={Math.min(pct, 100)} sx={{
        height: 7, borderRadius: 4, bgcolor: '#f1f5f9',
        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
      }} />
    </Box>
  );
}

function BarRow({ label, pct, color }) {
  return (
    <Box sx={{ mb: '14px', '&:last-child': { mb: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '5px' }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{pct}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct} sx={{
        height: 6, borderRadius: 3, bgcolor: '#f1f5f9',
        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
      }} />
    </Box>
  );
}

function PerfRow({ label, value, change, positive, last }) {
  return (
    <Box sx={{ py: '13px', borderBottom: last ? 'none' : '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 400 }}>{label}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: '3px' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</Typography>
        <Box sx={{ textAlign: 'right', lineHeight: 1.3 }}>
          <Typography variant="caption" fontWeight={700} sx={{ color: positive ? 'success.main' : 'error.main', display: 'block' }}>
            {positive ? '+' : ''}{change}
          </Typography>
          <Typography variant="caption" color="text.secondary">vs last month</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SectionCard({ title, subtitle, action, noPad, children }) {
  return (
    <Box sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        px: 3, pt: '18px', pb: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ flex: 1, ...(noPad ? {} : { px: 3, pb: '20px' }) }}>
        {children}
      </Box>
    </Box>
  );
}

export default function AdminAnalyticsScreen() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [period,  setPeriod]  = useState('30 Days');

  const load = useCallback(() => {
    setLoading(true);
    analyticsService.getSummary()
      .then(setData)
      .catch(() => setError('Could not load analytics data. Showing sample values.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const statCards = [
    { label: 'Total Revenue',   value: loading ? '—' : fmtMoney(data?.totalRevenue),                 trend: '23.5%', trendUp: true,  icon: AttachMoneyIcon,          iconBg: '#dcfce7', iconColor: '#16a34a' },
    { label: 'Total Orders',    value: loading ? '—' : (data?.totalOrders ?? 0).toLocaleString(),     trend: '15.2%', trendUp: true,  icon: ShoppingCartOutlinedIcon, iconBg: '#ede9fe', iconColor: '#7c3aed' },
    { label: 'New Customers',   value: loading ? '—' : (data?.totalCustomers ?? 0).toLocaleString(),  trend: '18.7%', trendUp: true,  icon: PersonAddOutlinedIcon,    iconBg: '#fce7f3', iconColor: '#E85D8E' },
    { label: 'Conversion Rate', value: loading ? '—' : `${data?.conversionRate ?? '3.2'}%`,           trend: '0.3%',  trendUp: false, icon: ShowChartIcon,            iconBg: '#fef3c7', iconColor: '#d97706' },
  ];

  const statusEntries = data?.orderStatusCounts
    ? Object.entries(data.orderStatusCounts).filter(([, v]) => Number(v) > 0)
    : [['DELIVERED', 8429], ['PROCESSING', 2147], ['SHIPPED', 1523], ['CANCELLED', 748]];
  const orderTotal = statusEntries.reduce((s, [, v]) => s + Number(v), 0) || 1;

  const products = data?.topProducts?.length ? data.topProducts : [
    { name: 'Wireless Bluetooth Headphones', unitsSold: 2847, revenue: 256000 },
    { name: 'Smart Fitness Tracker',          unitsSold: 1923, revenue: 189000 },
    { name: 'Organic Cotton T-Shirt',         unitsSold: 1647, revenue: 41000  },
    { name: 'Premium Coffee Beans',           unitsSold: 1234, revenue: 37000  },
    { name: 'Yoga Mat Pro',                   unitsSold: 987,  revenue: 29000  },
  ];

  const perf = data?.performance ?? {};

  return (
    <Box sx={{ minWidth: 900 }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Analytics' }]} />

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Analytics Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: '2px' }}>
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: '4px' }}>
          {['7 Days', '30 Days', '90 Days'].map((opt) => (
            <Box key={opt} onClick={() => setPeriod(opt)} sx={{
              px: '14px', py: '5px', borderRadius: '6px', cursor: 'pointer',
              bgcolor: period === opt ? '#E85D8E' : 'transparent',
              color: period === opt ? '#fff' : 'text.secondary',
              fontWeight: 600, fontSize: '0.82rem',
              transition: 'all 0.15s',
            }}>
              {opt}
            </Box>
          ))}
        </Box>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 2.5 }} onClose={() => setError('')}>{error}</Alert>}

      {/* ── Row 1: 4 stat cards ── */}
      <Box sx={{ display: 'flex', gap: '16px', mb: '16px' }}>
        {statCards.map((s, i) =>
          loading
            ? <Box key={i} sx={{ ...CARD_SX, flex: 1, p: '20px' }}>
                <Skeleton height={32} width="55%" sx={{ mb: 1 }} />
                <Skeleton height={16} width="40%" sx={{ mb: 1.5 }} />
                <Skeleton height={13} width="60%" />
              </Box>
            : <StatCard key={i} {...s} />
        )}
      </Box>

      {/* ── Row 2: Revenue Trend (wider) + Top Categories ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', mb: '16px' }}>
        <SectionCard
          title="Revenue Trend"
          subtitle="Monthly revenue over the last 12 months"
          noPad
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AppButton variant="outlined" size="small"
                sx={{ fontSize: '0.75rem', borderColor: 'divider', color: 'text.secondary', py: '3px', px: '10px', minWidth: 0 }}>
                Export
              </AppButton>
              <MoreHorizIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'pointer' }} />
            </Box>
          }
        >
          {loading
            ? <Box sx={{ px: 3, pb: 3 }}><Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1 }} /></Box>
            : <RevenueChart data={data?.revenueTrend ?? []} />}
        </SectionCard>

        <SectionCard title="Top Categories" subtitle="Sales by product category">
          {loading
            ? [1,2,3,4].map((k) => <Skeleton key={k} height={22} sx={{ mb: 1.5 }} />)
            : [
                { name: 'Bouquets',     pct: 42, color: '#E85D8E' },
                { name: 'Arrangements', pct: 28, color: '#8b5cf6' },
                { name: 'Single Stems', pct: 18, color: '#22c55e' },
                { name: 'Gift Sets',    pct: 12, color: '#f59e0b' },
              ].map((c) => <BarRow key={c.name} label={c.name} pct={c.pct} color={c.color} />)
          }
        </SectionCard>
      </Box>

      {/* ── Row 3: Customer Acquisition + Order Status Distribution ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px', mb: '16px' }}>
        <SectionCard title="Customer Acquisition" subtitle="New customers by traffic source">
          {loading
            ? [1,2,3,4].map((k) => <Skeleton key={k} height={22} sx={{ mb: 1.5 }} />)
            : [
                { src: 'Organic Search', pct: 38 },
                { src: 'Social Media',   pct: 27 },
                { src: 'Email',          pct: 21 },
                { src: 'Direct',         pct: 14 },
              ].map((s) => <BarRow key={s.src} label={s.src} pct={s.pct} color="#E85D8E" />)
          }
        </SectionCard>

        <SectionCard title="Order Status Distribution" subtitle="Current order fulfillment status">
          {loading
            ? [1,2,3,4].map((k) => <Skeleton key={k} height={28} sx={{ mb: 1.5 }} />)
            : statusEntries.map(([status, count]) => (
                <StatusBar
                  key={status}
                  label={status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                  count={Number(count)}
                  pct={(Number(count) / orderTotal) * 100}
                  color={STATUS_COLORS[status] ?? '#9ca3af'}
                />
              ))
          }
        </SectionCard>
      </Box>

      {/* ── Row 4: Top Products + Performance Metrics ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <SectionCard title="Top Products" subtitle="Best selling products this month" noPad>
          <Box sx={{ px: 3, pb: '12px' }}>
            {loading
              ? [1,2,3,4,5].map((k) => <Skeleton key={k} height={46} sx={{ mb: '4px' }} />)
              : products.map((p, i) => (
                  <Box key={i} sx={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    py: '12px',
                    borderBottom: i < products.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}>
                    <Box sx={{
                      width: 28, height: 28, borderRadius: '6px',
                      bgcolor: '#f1f5f9', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>{i + 1}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(p.unitsSold ?? 0).toLocaleString()} units sold
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="body2" fontWeight={800}>{fmtMoney(p.revenue)}</Typography>
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                        +{[23,18,12,5,-2][i] ?? 0}%
                      </Typography>
                    </Box>
                  </Box>
                ))
            }
          </Box>
        </SectionCard>

        <SectionCard title="Performance Metrics" subtitle="Key business indicators" noPad>
          <Box sx={{ px: 3, pb: '4px' }}>
            {loading
              ? [1,2,3,4,5].map((k) => <Skeleton key={k} height={52} sx={{ mb: '2px' }} />)
              : <>
                  <PerfRow label="Average Order Value"     value={`$${Number(perf.averageOrderValue    ?? 67.84).toFixed(2)}`}  change="12.3%" positive />
                  <PerfRow label="Customer Lifetime Value" value={`$${Number(perf.customerLifetimeValue ?? 428.92).toFixed(2)}`} change="8.7%"  positive />
                  <PerfRow label="Cart Abandonment Rate"   value={`${perf.cartAbandonmentRate ?? 68.4}%`}  change="2.1%"  positive={false} />
                  <PerfRow label="Return Rate"             value={`${perf.returnRate ?? 3.2}%`}            change="0.8%"  positive={false} />
                  <PerfRow label="Customer Satisfaction"   value={`${perf.customerSatisfaction ?? 4.8}/5`} change="0.2"   positive last />
                </>
            }
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}
