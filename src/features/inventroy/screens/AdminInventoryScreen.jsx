import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppCard, { StatCard } from '../../../components/common/AppCard';
import AppChip from '../../../components/common/AppChip';
import AppModal from '../../../components/common/AppModal';
import AppPagination from '../../../components/common/AppPagination';
import AppSelect from '../../../components/common/AppSelect';
import AppTable from '../../../components/common/AppTable';
import AppTextField from '../../../components/common/AppTextField';
import PageHeader from '../../../components/common/PageHeader';

const initialItems = [
  {
    id: 'INV-001',
    product: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    currentStock: 247,
    minThreshold: 50,
    unitPrice: '$89.99',
    status: 'active',
  },
  {
    id: 'INV-002',
    product: 'Smart Fitness Tracker',
    sku: 'SFT-102',
    category: 'Wearables',
    currentStock: 23,
    minThreshold: 30,
    unitPrice: '$129.99',
    status: 'low',
  },
  {
    id: 'INV-003',
    product: 'Organic Cotton T-Shirt',
    sku: 'OCT-205',
    category: 'Clothing',
    currentStock: 0,
    minThreshold: 25,
    unitPrice: '$24.99',
    status: 'critical',
  },
  {
    id: 'INV-004',
    product: 'Indoor Succulent Set',
    sku: 'ISS-013',
    category: 'Plants',
    currentStock: 88,
    minThreshold: 20,
    unitPrice: '$54.90',
    status: 'active',
  },
  {
    id: 'INV-005',
    product: 'Ceramic Planter Pot',
    sku: 'CPP-045',
    category: 'Home',
    currentStock: 42,
    minThreshold: 15,
    unitPrice: '$19.90',
    status: 'active',
  },
];

const statusOptions = [
  { value: 'all', label: 'All Stock Status' },
  { value: 'active', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'critical', label: 'Out of Stock' },
];

export default function AdminInventoryScreen() {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    product: '',
    sku: '',
    category: '',
    currentStock: 0,
    minThreshold: 0,
    unitPrice: '',
    status: 'active',
  });

  const stats = useMemo(() => {
    const totalProducts = items.length;
    const lowStock = items.filter((i) => i.currentStock > 0 && i.currentStock <= i.minThreshold).length;
    const outOfStock = items.filter((i) => i.currentStock === 0).length;
    const totalValue = items.reduce((sum, i) => sum + Number(i.unitPrice.replace('$', '')) * i.currentStock, 0);
    const newArrivals = items.filter((i) => i.id.endsWith('4') || i.id.endsWith('5')).length;
    return { totalProducts, lowStock, outOfStock, totalValue, newArrivals };
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const statusMatches = statusFilter === 'all' || item.status === statusFilter;
      const searchMatches =
        !term ||
        item.product.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return statusMatches && searchMatches;
    });
  }, [items, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {row.product}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.sku} • {row.category}
          </Typography>
        </Box>
      ),
    },
    { key: 'currentStock', label: 'Current Stock', align: 'center' },
    { key: 'minThreshold', label: 'Min Threshold', align: 'center' },
    { key: 'unitPrice', label: 'Unit Price', align: 'right' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => <AppChip status={value} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <AppButton size="small" variant="outlined" onClick={() => window.alert(`Edit ${row.product}`)}>
            Edit
          </AppButton>
          <AppButton
            size="small"
            color="error"
            variant="outlined"
            onClick={() => setItems((prev) => prev.filter((item) => item.id !== row.id))}
          >
            Delete
          </AppButton>
        </Stack>
      ),
    },
  ];

  const handleCreate = () => {
    if (!newItem.product || !newItem.sku || !newItem.unitPrice) return;
    setItems((prev) => [
      {
        id: `INV-${String(prev.length + 1).padStart(3, '0')}`,
        ...newItem,
      },
      ...prev,
    ]);
    setIsNewModalOpen(false);
    setNewItem({
      product: '',
      sku: '',
      category: '',
      currentStock: 0,
      minThreshold: 0,
      unitPrice: '',
      status: 'active',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Inventory' }]} />

      <PageHeader
        title="Inventory Management"
        subtitle="Monitor and manage product stock levels"
        action={
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <AppButton variant="outlined" onClick={() => window.alert('Export clicked')}>
              Export
            </AppButton>
            <AppButton onClick={() => setIsNewModalOpen(true)}>Add Product</AppButton>
          </Stack>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5, mb: 2 }}>
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Low Stock" value={stats.lowStock} trend={`${stats.lowStock} need attention`} trendPositive={false} />
        <StatCard label="Out of Stock" value={stats.outOfStock} trend={`${stats.outOfStock} urgent`} trendPositive={false} />
        <StatCard label="Total Value" value={`$${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} trend="+12% inventory worth" />
        <StatCard label="New Arrivals" value={stats.newArrivals} trend="since last week" />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <AppTextField
          label="Search products"
          placeholder="Search by name, SKU, category"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <AppSelect
          label="Stock status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          options={statusOptions}
          sx={{ width: { xs: '100%', sm: 220 } }}
        />
      </Stack>

      <AppTable columns={columns} rows={pagedItems} emptyMessage="No products found" />

      <AppPagination
        page={page}
        count={totalPages}
        total={filteredItems.length}
        rowsPerPage={rowsPerPage}
        onPageChange={(val) => setPage(val)}
        onRowsPerPageChange={(val) => {
          setRowsPerPage(val);
          setPage(1);
        }}
      />

      <AppModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add Inventory Item"
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </AppButton>
            <AppButton onClick={handleCreate}>Create</AppButton>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <AppTextField
            label="Product"
            value={newItem.product}
            onChange={(e) => setNewItem((prev) => ({ ...prev, product: e.target.value }))}
          />
          <AppTextField
            label="SKU"
            value={newItem.sku}
            onChange={(e) => setNewItem((prev) => ({ ...prev, sku: e.target.value }))}
          />
          <AppTextField
            label="Category"
            value={newItem.category}
            onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
          />
          <AppTextField
            label="Current Stock"
            type="number"
            value={newItem.currentStock}
            onChange={(e) => setNewItem((prev) => ({ ...prev, currentStock: Number(e.target.value) }))}
          />
          <AppTextField
            label="Min Threshold"
            type="number"
            value={newItem.minThreshold}
            onChange={(e) => setNewItem((prev) => ({ ...prev, minThreshold: Number(e.target.value) }))}
          />
          <AppTextField
            label="Unit Price"
            placeholder="$0.00"
            value={newItem.unitPrice}
            onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
          />
          <AppSelect
            label="Status"
            value={newItem.status}
            onChange={(e) => setNewItem((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'active', label: 'In Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'critical', label: 'Out of Stock' },
            ]}
          />
        </Stack>
      </AppModal>
    </Box>
  );
}
