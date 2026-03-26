import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import AppButton from '../../components/common/AppButton';
import AppTextField from '../../components/common/AppTextField';
import AppSelect from '../../components/common/AppSelect';
import AppChip from '../../components/common/AppChip';
import AppModal from '../../components/common/AppModal';
import AppAvatar from '../../components/common/AppAvatar';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import AppPagination from '../../components/common/AppPagination';
import AppTable from '../../components/common/AppTable';
import PageHeader from '../../components/common/PageHeader';
import { AppCard, AppCardContent, StatCard, ProductCard } from '../../components/common/AppCard';
import { UILoader } from '../../core/utils/UILoader';

// ─── helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({ label }) {
  return (
    <Box sx={{ mb: 3, mt: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
        <Box sx={{ width: 4, height: 22, borderRadius: 99, bgcolor: 'primary.main' }} />
        <Typography variant="h6" fontWeight={800}>
          {label}
        </Typography>
      </Box>
      <Divider />
    </Box>
  );
}

function Group({ label, code, children, vertical = false }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ mb: 3.5 }}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1.5,
            color: 'text.secondary',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: vertical ? 'column' : 'row',
          alignItems: vertical ? 'flex-start' : 'center',
          gap: 2,
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {children}
      </Box>
      {code && (
        <Box sx={{ mt: 0 }}>
          <Box
            onClick={() => setOpen((p) => !p)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {open ? '▲ hide code' : '▼ show code'}
            </Typography>
          </Box>
          {open && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'auto',
              }}
            >
              <Typography
                component="pre"
                sx={{
                  m: 0,
                  fontSize: '0.78rem',
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  color: 'text.primary',
                  whiteSpace: 'pre',
                  lineHeight: 1.9,
                }}
              >
                {code}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

// ─── table data ────────────────────────────────────────────────────────────────

const ORDER_COLS = [
  {
    key: 'id',
    label: 'Order ID',
    render: (v) => (
      <Typography variant="body2" color="primary.main" fontWeight={700}>
        {v}
      </Typography>
    ),
  },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'total', label: 'Total', align: 'right' },
  {
    key: 'status',
    label: 'Status',
    render: (v) => <AppChip status={v} />,
  },
  {
    key: 'actions',
    label: '',
    align: 'right',
    render: (_, row) => (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <AppButton size="small" variant="outlined" startIcon={<EditOutlinedIcon />}>
          Edit
        </AppButton>
        <AppButton size="small" color="error" variant="outlined" startIcon={<DeleteOutlineIcon />}>
          Delete
        </AppButton>
      </Box>
    ),
  },
];

const ORDER_ROWS = [
  {
    id: '#ORD-001',
    customer: 'Sarah Johnson',
    date: 'Jan 15, 2024',
    total: '$89.99',
    status: 'delivered',
  },
  {
    id: '#ORD-002',
    customer: 'Mike Chen',
    date: 'Jan 14, 2024',
    total: '$45.50',
    status: 'shipped',
  },
  {
    id: '#ORD-003',
    customer: 'Emma Davis',
    date: 'Jan 13, 2024',
    total: '$120.00',
    status: 'processing',
  },
  {
    id: '#ORD-004',
    customer: 'John Smith',
    date: 'Jan 12, 2024',
    total: '$34.00',
    status: 'pending',
  },
  {
    id: '#ORD-005',
    customer: 'Anna Lee',
    date: 'Jan 11, 2024',
    total: '$78.25',
    status: 'cancelled',
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ComponentLibrary() {
  const [showPw, setShowPw] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rpp, setRpp] = useState(25);
  const [selectVal, setSelectVal] = useState('');
  const [filterVal, setFilterVal] = useState('');

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        py: 5,
        px: { xs: 2, md: 4 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      {/* header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalFloristIcon sx={{ color: 'primary.contrastText', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={900} lineHeight={1}>
              Component Library
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              FlowerCart · All reusable components with live examples
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            📌 Click <strong>"show code"</strong> under any example to copy the exact usage snippet.
            Visit{' '}
            <code
              style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4 }}
            >
              /ui
            </code>{' '}
            or{' '}
            <code
              style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4 }}
            >
              /admin/ui
            </code>{' '}
            in the browser.
          </Typography>
        </Box>
      </Box>

      {/* ════════════════════════════════════════════
          AppButton
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppButton" />

      <Group
        label="variant"
        code={`<AppButton variant="contained">Contained</AppButton>
<AppButton variant="outlined">Outlined</AppButton>
<AppButton variant="text">Text</AppButton>`}
      >
        <AppButton variant="contained">Contained</AppButton>
        <AppButton variant="outlined">Outlined</AppButton>
        <AppButton variant="text">Text</AppButton>
      </Group>

      <Group
        label="size"
        code={`<AppButton size="small">Small</AppButton>
<AppButton size="medium">Medium</AppButton>
<AppButton size="large">Large</AppButton>`}
      >
        <AppButton size="small">Small</AppButton>
        <AppButton size="medium">Medium</AppButton>
        <AppButton size="large">Large</AppButton>
      </Group>

      <Group
        label="color"
        code={`<AppButton color="primary">Primary</AppButton>
<AppButton color="secondary">Secondary</AppButton>
<AppButton color="error">Error</AppButton>
<AppButton color="success">Success</AppButton>`}
      >
        <AppButton color="primary">Primary</AppButton>
        <AppButton color="secondary">Secondary</AppButton>
        <AppButton color="error">Error</AppButton>
        <AppButton color="success">Success</AppButton>
      </Group>

      <Group
        label="startIcon / endIcon"
        code={`<AppButton startIcon={<AddIcon />}>Add Product</AppButton>
<AppButton variant="outlined" startIcon={<DownloadIcon />}>Export</AppButton>
<AppButton color="error" variant="outlined" startIcon={<DeleteOutlineIcon />}>Delete</AppButton>`}
      >
        <AppButton startIcon={<AddIcon />}>Add Product</AppButton>
        <AppButton variant="outlined" startIcon={<DownloadIcon />}>
          Export
        </AppButton>
        <AppButton color="error" variant="outlined" startIcon={<DeleteOutlineIcon />}>
          Delete
        </AppButton>
      </Group>

      <Group
        label="loading={true}"
        code={`<AppButton loading>Saving...</AppButton>
<AppButton loading variant="outlined">Loading</AppButton>`}
      >
        <AppButton loading>Saving...</AppButton>
        <AppButton loading variant="outlined">
          Loading
        </AppButton>
      </Group>

      <Group
        label="disabled={true}"
        code={`<AppButton disabled>Disabled</AppButton>
<AppButton disabled variant="outlined">Disabled</AppButton>`}
      >
        <AppButton disabled>Disabled</AppButton>
        <AppButton disabled variant="outlined">
          Disabled
        </AppButton>
      </Group>

      <Group label="fullWidth={true}" code={`<AppButton fullWidth>Full Width</AppButton>`} vertical>
        <Box sx={{ width: '100%' }}>
          <AppButton fullWidth>Full Width Button</AppButton>
        </Box>
      </Group>

      <Group
        label="UILoader.show() / UILoader.hide()  — import { UILoader } from '../../core/utils/UILoader'"
        code={`import { UILoader } from '../../core/utils/UILoader';

UILoader.show();                      // backdrop spinner only
UILoader.show('Saving order...');     // spinner + message
UILoader.hide();                      // dismiss`}
      >
        <AppButton
          onClick={() => {
            UILoader.show('Loading data...');
            setTimeout(() => UILoader.hide(), 2000);
          }}
        >
          UILoader.show('message')
        </AppButton>
        <AppButton
          variant="outlined"
          onClick={() => {
            UILoader.show();
            setTimeout(() => UILoader.hide(), 2000);
          }}
        >
          UILoader.show() no message
        </AppButton>
      </Group>

      {/* ════════════════════════════════════════════
          AppTextField
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppTextField" />

      <Group
        label="basic"
        code={`<AppTextField label="First name" value={value} onChange={(e) => setValue(e.target.value)} />`}
      >
        <Box sx={{ width: 280 }}>
          <AppTextField label="First name" placeholder="Enter first name" />
        </Box>
      </Group>

      <Group
        label="type  |  size"
        code={`<AppTextField label="Email" type="email" size="medium" />
<AppTextField label="Search" size="small" />`}
      >
        <Box sx={{ width: 260 }}>
          <AppTextField label="Email" type="email" placeholder="you@example.com" />
        </Box>
        <Box sx={{ width: 220 }}>
          <AppTextField label="Search" size="small" placeholder="Search..." />
        </Box>
      </Group>

      <Group
        label="startAdornment  |  endAdornment"
        code={`import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

<AppTextField
  label="Search flowers"
  startAdornment={
    <InputAdornment position="start">
      <SearchIcon fontSize="small" />
    </InputAdornment>
  }
/>

<AppTextField
  label="Password"
  type={show ? 'text' : 'password'}
  endAdornment={
    <InputAdornment position="end">
      <IconButton size="small" onClick={() => setShow(p => !p)}>
        {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  }
/>`}
      >
        <Box sx={{ width: 260 }}>
          <AppTextField
            label="Search flowers"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
          />
        </Box>
        <Box sx={{ width: 260 }}>
          <AppTextField
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Enter password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPw((p) => !p)} edge="end">
                  {showPw ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </Group>

      <Group
        label="error={true}  |  helperText"
        code={`<AppTextField label="Email" error helperText="Enter a valid email address" />`}
      >
        <Box sx={{ width: 300 }}>
          <AppTextField label="Email" error helperText="Enter a valid email address" />
        </Box>
      </Group>

      <Group
        label="multiline  |  rows"
        code={`<AppTextField label="Notes" multiline rows={4} placeholder="Add special instructions..." />`}
        vertical
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <AppTextField
            label="Order notes"
            multiline
            rows={4}
            placeholder="Add special instructions..."
          />
        </Box>
      </Group>

      <Group
        label="disabled={true}"
        code={`<AppTextField label="Order ID" value="#ORD-001" disabled />`}
      >
        <Box sx={{ width: 280 }}>
          <AppTextField label="Order ID" value="#ORD-001" disabled />
        </Box>
      </Group>

      {/* ════════════════════════════════════════════
          AppSelect
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppSelect" />

      <Group
        label="basic  —  options: [{ value, label }]"
        code={`const options = [
  { value: 'roses',   label: 'Roses'   },
  { value: 'lilies',  label: 'Lilies'  },
  { value: 'tulips',  label: 'Tulips'  },
];

<AppSelect
  label="Flower Type"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  options={options}
/>`}
      >
        <Box sx={{ width: 240 }}>
          <AppSelect
            label="Flower Type"
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            options={[
              { value: 'roses', label: 'Roses' },
              { value: 'lilies', label: 'Lilies' },
              { value: 'tulips', label: 'Tulips' },
              { value: 'orchids', label: 'Orchids' },
            ]}
          />
        </Box>
      </Group>

      <Group
        label="placeholder  |  size='small'"
        code={`<AppSelect
  size="small"
  label="Status"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="All statuses"
  options={[
    { value: 'pending',    label: 'Pending'    },
    { value: 'processing', label: 'Processing' },
    { value: 'delivered',  label: 'Delivered'  },
  ]}
/>`}
      >
        <Box sx={{ width: 200 }}>
          <AppSelect
            size="small"
            label="Status"
            value={filterVal}
            onChange={(e) => setFilterVal(e.target.value)}
            placeholder="All statuses"
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'delivered', label: 'Delivered' },
            ]}
          />
        </Box>
      </Group>

      <Group
        label="error={true}  |  helperText"
        code={`<AppSelect label="Occasion" error helperText="Please select an occasion" options={options} />`}
      >
        <Box sx={{ width: 240 }}>
          <AppSelect
            label="Occasion"
            value=""
            onChange={() => {}}
            error
            helperText="Please select an occasion"
            options={[
              { value: 'birthday', label: 'Birthday' },
              { value: 'anniversary', label: 'Anniversary' },
            ]}
          />
        </Box>
      </Group>

      {/* ════════════════════════════════════════════
          AppChip
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppChip" />

      <Group
        label="status prop — auto maps label + color"
        code={`<AppChip status="delivered" />
<AppChip status="shipped" />
<AppChip status="processing" />
<AppChip status="pending" />
<AppChip status="cancelled" />
<AppChip status="active" />
<AppChip status="inactive" />
<AppChip status="open" />
<AppChip status="in progress" />
<AppChip status="resolved" />
<AppChip status="low" />
<AppChip status="critical" />`}
      >
        {[
          'delivered',
          'shipped',
          'processing',
          'pending',
          'cancelled',
          'active',
          'inactive',
          'open',
          'in progress',
          'resolved',
          'low',
          'critical',
        ].map((s) => (
          <AppChip key={s} status={s} />
        ))}
      </Group>

      <Group
        label="custom label + color — when status is not in the map"
        code={`<AppChip label="New Arrival" color="primary" />
<AppChip label="Best Seller" color="secondary" />
<AppChip label="Flash Sale" color="error" />
<AppChip label="In Stock" color="success" />`}
      >
        <AppChip label="New Arrival" color="primary" />
        <AppChip label="Best Seller" color="secondary" />
        <AppChip label="Flash Sale" color="error" />
        <AppChip label="In Stock" color="success" />
      </Group>

      {/* ════════════════════════════════════════════
          AppAvatar
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppAvatar" />

      <Group
        label="name prop — auto initials + rose shade from name hash"
        code={`<AppAvatar name="Sarah Johnson" />           {/* size default 36 */}
<AppAvatar name="Mike Chen"     size={44} />
<AppAvatar name="Emma Davis"    size={52} />
<AppAvatar name="John Smith"    size={60} />`}
      >
        <AppAvatar name="Sarah Johnson" />
        <AppAvatar name="Mike Chen" size={44} />
        <AppAvatar name="Emma Davis" size={52} />
        <AppAvatar name="John Smith" size={60} />
        <AppAvatar name="Anna Lee" size={68} />
      </Group>

      <Group
        label="src prop — image avatar"
        code={`<AppAvatar name="Sarah Johnson" src="https://i.pravatar.cc/150?img=1" size={48} />`}
      >
        <AppAvatar name="Sarah Johnson" src="https://i.pravatar.cc/150?img=1" size={48} />
        <AppAvatar name="Mike Chen" src="https://i.pravatar.cc/150?img=3" size={48} />
        <AppAvatar name="Emma Davis" src="https://i.pravatar.cc/150?img=5" size={48} />
      </Group>

      {/* ════════════════════════════════════════════
          AppCard  /  StatCard  /  ProductCard
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppCard · StatCard · ProductCard" />

      <Group
        label="StatCard — dashboard KPI tiles"
        code={`import { StatCard } from '../../components/common/AppCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

<StatCard
  icon={<TrendingUpIcon />}
  label="Total Revenue"
  value="$47,832"
  trend="+12.5% this month"
  trendPositive={true}          // green — false = red
/>`}
        vertical
      >
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {[
            {
              icon: <TrendingUpIcon />,
              label: 'Total Revenue',
              value: '$47,832',
              trend: '+12.5%',
              pos: true,
            },
            {
              icon: <ShoppingCartIcon />,
              label: 'Total Orders',
              value: '1,247',
              trend: '+8.2%',
              pos: true,
            },
            {
              icon: <PeopleIcon />,
              label: 'Active Users',
              value: '8,942',
              trend: '-2.1%',
              pos: false,
            },
            {
              icon: <LocalFloristIcon />,
              label: 'Products',
              value: '364',
              trend: '+4 new',
              pos: true,
            },
          ].map((s) => (
            <Grid key={s.label} size={{ xs: 12, sm: 6 }}>
              <StatCard
                icon={s.icon}
                label={s.label}
                value={s.value}
                trend={s.trend}
                trendPositive={s.pos}
              />
            </Grid>
          ))}
        </Grid>
      </Group>

      <Group
        label="AppCard + AppCardContent — fully custom card"
        code={`import { AppCard, AppCardContent } from '../../components/common/AppCard';

<AppCard>
  <AppCardContent>
    <Typography variant="h6" fontWeight={700}>Card Title</Typography>
    <Typography variant="body2" color="text.secondary">Any content here.</Typography>
  </AppCardContent>
</AppCard>`}
      >
        <Box sx={{ width: 260 }}>
          <AppCard>
            <AppCardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Custom Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use AppCard + AppCardContent for any layout.
              </Typography>
            </AppCardContent>
          </AppCard>
        </Box>
      </Group>

      <Group
        label="ProductCard — shop grid tile"
        code={`import { ProductCard } from '../../components/common/AppCard';

<ProductCard
  name="Premium Red Roses"
  price="$39.99"
  originalPrice="$54.99"   // optional strikethrough
  badge="SALE"              // optional top-left badge
  actions={
    <AppButton size="small" fullWidth startIcon={<ShoppingCartIcon />}>
      Add to Cart
    </AppButton>
  }
/>`}
      >
        {[
          { name: 'Premium Red Roses', price: '$39.99', originalPrice: '$54.99', badge: 'SALE' },
          { name: 'Lilies Bouquet', price: '$29.99', badge: 'NEW' },
          { name: 'Mixed Tulips', price: '$24.99', originalPrice: '$34.99' },
        ].map((p) => (
          <Box key={p.name} sx={{ width: 180 }}>
            <ProductCard
              {...p}
              actions={
                <AppButton size="small" fullWidth startIcon={<ShoppingCartIcon />}>
                  Add to Cart
                </AppButton>
              }
            />
          </Box>
        ))}
      </Group>

      {/* ════════════════════════════════════════════
          AppTable
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppTable" />

      <Group
        label="columns config — key / label / align / render(value, row)"
        code={`const columns = [
  {
    key: 'id',
    label: 'Order ID',
    render: (v) => (
      <Typography variant="body2" color="primary.main" fontWeight={700}>{v}</Typography>
    ),
  },
  { key: 'customer', label: 'Customer' },
  { key: 'total',    label: 'Total', align: 'right' },
  {
    key: 'status',
    label: 'Status',
    render: (v) => <AppChip status={v} />,
  },
  {
    key: 'actions',
    label: '',
    align: 'right',
    render: (_, row) => (
      <AppButton size="small" variant="outlined" startIcon={<EditOutlinedIcon />}>Edit</AppButton>
    ),
  },
];

const rows = [
  { id: '#ORD-001', customer: 'Sarah Johnson', total: '$89.99', status: 'delivered' },
  ...
];

<AppTable columns={columns} rows={rows} />`}
        vertical
      >
        <Box sx={{ width: '100%' }}>
          <AppTable columns={ORDER_COLS} rows={ORDER_ROWS} />
        </Box>
      </Group>

      <Group
        label="loading={true} — skeleton rows"
        code={`<AppTable columns={columns} rows={[]} loading={true} />`}
        vertical
      >
        <Box sx={{ width: '100%' }}>
          <AppTable columns={ORDER_COLS.slice(0, 4)} rows={[]} loading />
        </Box>
      </Group>

      <Group
        label="empty state — emptyMessage prop"
        code={`<AppTable columns={columns} rows={[]} emptyMessage="No orders found for this filter" />`}
        vertical
      >
        <Box sx={{ width: '100%' }}>
          <AppTable
            columns={ORDER_COLS.slice(0, 4)}
            rows={[]}
            emptyMessage="No orders found for this filter"
          />
        </Box>
      </Group>

      {/* ════════════════════════════════════════════
          AppPagination
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppPagination" />

      <Group
        label="with rows-per-page selector"
        code={`const [page, setPage] = useState(1);
const [rpp,  setRpp]  = useState(25);

<AppPagination
  page={page}
  count={10}                              // total pages
  total={247}                             // total records
  rowsPerPage={rpp}
  onPageChange={(p) => setPage(p)}
  onRowsPerPageChange={(r) => setRpp(r)}
  rowsPerPageOptions={[10, 25, 50]}
/>`}
        vertical
      >
        <Box
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <AppPagination
            page={page}
            count={10}
            total={247}
            rowsPerPage={rpp}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={(r) => setRpp(r)}
          />
        </Box>
      </Group>

      <Group
        label="showRowsPerPage={false}"
        code={`<AppPagination
  page={page}
  count={5}
  total={50}
  rowsPerPage={10}
  onPageChange={(p) => setPage(p)}
  showRowsPerPage={false}
/>`}
        vertical
      >
        <Box
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <AppPagination
            page={page}
            count={5}
            total={50}
            rowsPerPage={10}
            onPageChange={(p) => setPage(p)}
            showRowsPerPage={false}
          />
        </Box>
      </Group>

      {/* ════════════════════════════════════════════
          AppModal
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppModal" />

      <Group
        label="edit modal — maxWidth='sm' (default)"
        code={`const [open, setOpen] = useState(false);

<AppButton onClick={() => setOpen(true)}>Edit Order</AppButton>

<AppModal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit Order"
  actions={
    <>
      <AppButton variant="outlined" onClick={() => setOpen(false)}>Cancel</AppButton>
      <AppButton onClick={() => setOpen(false)}>Save Changes</AppButton>
    </>
  }
>
  <AppTextField label="Customer Name" />
  <AppSelect label="Status" value="" onChange={() => {}} options={statusOptions} />
</AppModal>`}
      >
        <AppButton onClick={() => setEditModalOpen(true)}>Open Edit Modal</AppButton>
        <AppModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Order"
          actions={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <AppButton variant="outlined" onClick={() => setEditModalOpen(false)}>
                Cancel
              </AppButton>
              <AppButton onClick={() => setEditModalOpen(false)}>Save Changes</AppButton>
            </Box>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <AppTextField label="Customer Name" defaultValue="Sarah Johnson" />
            <AppTextField label="Email" defaultValue="sarah@example.com" />
            <AppSelect
              label="Status"
              value="delivered"
              onChange={() => {}}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'delivered', label: 'Delivered' },
              ]}
            />
          </Box>
        </AppModal>
      </Group>

      <Group
        label="confirm / delete modal — maxWidth='xs'"
        code={`<AppModal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete Product"
  maxWidth="xs"
  actions={
    <>
      <AppButton variant="outlined" onClick={() => setOpen(false)}>Cancel</AppButton>
      <AppButton color="error" onClick={() => setOpen(false)}>Delete</AppButton>
    </>
  }
>
  <Typography>
    Are you sure you want to delete <strong>Premium Red Roses</strong>?
    This cannot be undone.
  </Typography>
</AppModal>`}
      >
        <AppButton color="error" variant="outlined" onClick={() => setDeleteModalOpen(true)}>
          Open Delete Modal
        </AppButton>
        <AppModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Product"
          maxWidth="xs"
          actions={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <AppButton variant="outlined" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </AppButton>
              <AppButton color="error" onClick={() => setDeleteModalOpen(false)}>
                Delete
              </AppButton>
            </Box>
          }
        >
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>Premium Red Roses</strong>? This action cannot
            be undone.
          </Typography>
        </AppModal>
      </Group>

      {/* ════════════════════════════════════════════
          AppBreadcrumbs
      ════════════════════════════════════════════ */}
      <SectionTitle label="AppBreadcrumbs" />

      <Group
        label="items: [{ label, to }]  — last item has no 'to' = current page"
        code={`<AppBreadcrumbs
  items={[
    { label: 'Dashboard', to: '/admin' },
    { label: 'Orders',    to: '/admin/orders' },
    { label: 'Order #ORD-001' },          // no 'to' = current page (bold, no link)
  ]}
/>`}
        vertical
      >
        <AppBreadcrumbs
          items={[
            { label: 'Dashboard', to: '/admin' },
            { label: 'Orders', to: '/admin/orders' },
            { label: 'Order #ORD-001' },
          ]}
        />
        <AppBreadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: 'Premium Red Roses' },
          ]}
        />
      </Group>

      {/* ════════════════════════════════════════════
          PageHeader
      ════════════════════════════════════════════ */}
      <SectionTitle label="PageHeader" />

      <Group
        label="title + subtitle + action"
        code={`<PageHeader
  title="Products"
  subtitle="Manage your flower catalog"
  action={
    <AppButton startIcon={<AddIcon />}>Add Product</AppButton>
  }
/>`}
        vertical
      >
        <Box
          sx={{
            width: '100%',
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <PageHeader
            title="Products"
            subtitle="Manage your flower catalog and inventory"
            action={<AppButton startIcon={<AddIcon />}>Add Product</AppButton>}
          />
        </Box>
      </Group>

      <Group
        label="multiple actions"
        code={`<PageHeader
  title="Orders"
  subtitle="247 total orders"
  action={
    <Box sx={{ display: 'flex', gap: 1 }}>
      <AppButton variant="outlined" startIcon={<DownloadIcon />}>Export</AppButton>
      <AppButton startIcon={<AddIcon />}>New Order</AppButton>
    </Box>
  }
/>`}
        vertical
      >
        <Box
          sx={{
            width: '100%',
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <PageHeader
            title="Orders"
            subtitle="247 total orders this month"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <AppButton variant="outlined" startIcon={<DownloadIcon />}>
                  Export
                </AppButton>
                <AppButton startIcon={<AddIcon />}>New Order</AppButton>
              </Box>
            }
          />
        </Box>
      </Group>

      {/* ════════════════════════════════════════════
          Putting it all together
      ════════════════════════════════════════════ */}
      <SectionTitle label="Real Screen Pattern" />

      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Copy this pattern into any screen file inside <code>features/</code>
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'auto',
          }}
        >
          <Typography
            component="pre"
            sx={{
              m: 0,
              fontSize: '0.78rem',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              color: 'text.primary',
              whiteSpace: 'pre',
              lineHeight: 2,
            }}
          >
            {`import { useState } from 'react';
import Box from '@mui/material/Box';
import PageHeader        from '../../../components/common/PageHeader';
import AppBreadcrumbs    from '../../../components/common/AppBreadcrumbs';
import AppButton         from '../../../components/common/AppButton';
import AppTable          from '../../../components/common/AppTable';
import AppChip           from '../../../components/common/AppChip';
import AppPagination     from '../../../components/common/AppPagination';
import AppSelect         from '../../../components/common/AppSelect';
import AppModal          from '../../../components/common/AppModal';
import AppTextField      from '../../../components/common/AppTextField';
import { UILoader }      from '../../../core/utils/UILoader';
import AddIcon           from '@mui/icons-material/Add';
import DownloadIcon      from '@mui/icons-material/Download';

const columns = [
  { key: 'id',       label: 'ID'       },
  { key: 'customer', label: 'Customer' },
  { key: 'total',    label: 'Total', align: 'right' },
  { key: 'status',   label: 'Status', render: (v) => <AppChip status={v} /> },
];

export default function AdminOrdersScreen() {
  const [page, setPage]       = useState(1);
  const [rpp, setRpp]         = useState(25);
  const [status, setStatus]   = useState('');
  const [modalOpen, setModal] = useState(false);
  const [rows, setRows]       = useState([]);

  const loadOrders = async () => {
    UILoader.show('Loading orders...');
    try {
      // const res = await orderService.getOrders(status, { page, limit: rpp });
      // setRows(res);
    } finally {
      UILoader.hide();
    }
  };

  return (
    <Box>
      <AppBreadcrumbs
        items={[
          { label: 'Dashboard', to: '/admin' },
          { label: 'Orders' },
        ]}
      />

      <PageHeader
        title="Orders"
        subtitle="247 total orders"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" startIcon={<DownloadIcon />}>Export</AppButton>
            <AppButton startIcon={<AddIcon />} onClick={() => setModal(true)}>New Order</AppButton>
          </Box>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <AppSelect
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="All statuses"
          options={[
            { value: 'pending',    label: 'Pending'    },
            { value: 'processing', label: 'Processing' },
            { value: 'delivered',  label: 'Delivered'  },
          ]}
          sx={{ width: 200 }}
        />
      </Box>

      <AppTable columns={columns} rows={rows} emptyMessage="No orders found" />

      <AppPagination
        page={page}
        count={Math.ceil(247 / rpp)}
        total={247}
        rowsPerPage={rpp}
        onPageChange={setPage}
        onRowsPerPageChange={setRpp}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModal(false)}
        title="New Order"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <AppButton variant="outlined" onClick={() => setModal(false)}>Cancel</AppButton>
            <AppButton onClick={() => setModal(false)}>Create Order</AppButton>
          </Box>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <AppTextField label="Customer Name" />
          <AppTextField label="Email" type="email" />
        </Box>
      </AppModal>
    </Box>
  );
}`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          FlowerCart Component Library · {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}
