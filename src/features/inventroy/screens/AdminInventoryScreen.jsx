import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import { StatCard } from '../../../components/common/AppCard';
import AppChip from '../../../components/common/AppChip';
import AppModal from '../../../components/common/AppModal';
import AppPagination from '../../../components/common/AppPagination';
import AppTable from '../../../components/common/AppTable';
import AppTextField from '../../../components/common/AppTextField';
import PageHeader from '../../../components/common/PageHeader';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../../products/services/productService';

const PAGE_SIZE = 20;

export default function AdminInventoryScreen() {
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(null); // { productId, productName, stockQty, reorderLevel }
  const [saving, setSaving] = useState(false);
  const [editFields, setEditFields] = useState({ stockQty: 0, reorderLevel: 5 });

  const loadLowStock = useCallback(() => {
    setLoading(true);
    inventoryService.getLowStock({ page: page - 1, size: PAGE_SIZE })
      .then((paged) => {
        setItems(paged.data ?? []);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load inventory.'))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadLowStock(); }, [loadLowStock]);

  // Also load all products for the stats
  useEffect(() => {
    productService.getAdminProducts({ page: 0, size: 1 })
      .then((paged) => setAllProducts(paged))
      .catch(() => {});
  }, []);

  const openEdit = (item) => {
    setEditFields({ stockQty: item.stockQty, reorderLevel: item.reorderLevel });
    setEditModal(item);
  };

  const handleSave = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      await inventoryService.updateInventory(editModal.productId, editFields);
      setEditModal(null);
      loadLowStock();
    } catch (err) {
      setError(err.message || 'Failed to update inventory.');
    } finally {
      setSaving(false);
    }
  };

  const outOfStockCount = items.filter((i) => i.stockQty === 0).length;
  const lowStockCount = items.filter((i) => i.stockQty > 0 && i.lowStock).length;

  const columns = [
    {
      key: 'productName',
      label: 'Product',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">ID: {row.productId}</Typography>
        </Box>
      ),
    },
    { key: 'stockQty', label: 'Current Stock', align: 'center' },
    { key: 'reorderLevel', label: 'Reorder Level', align: 'center' },
    {
      key: 'lowStock',
      label: 'Status',
      align: 'center',
      render: (_, row) => (
        <AppChip
          status={row.stockQty === 0 ? 'critical' : row.lowStock ? 'low' : 'active'}
          label={row.stockQty === 0 ? 'Out of Stock' : row.lowStock ? 'Low Stock' : 'OK'}
        />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <AppButton size="small" variant="outlined" onClick={() => openEdit(row)}>
          Update Stock
        </AppButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Inventory' }]} />

      <PageHeader
        title="Inventory Management"
        subtitle="Monitor low-stock and out-of-stock items"
        action={
          <AppButton variant="outlined" onClick={loadLowStock}>Refresh</AppButton>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        <StatCard label="Low Stock Items" value={loading ? '—' : totalElements} trend="Needs attention" trendPositive={false} />
        <StatCard label="Out of Stock" value={loading ? '—' : outOfStockCount} trend="Urgent" trendPositive={false} />
        <StatCard label="Low but Available" value={loading ? '—' : lowStockCount} trend="Order soon" trendPositive={false} />
        <StatCard label="Total Products" value={allProducts?.totalElements ?? '—'} trendPositive />
      </Box>

      {loading ? (
        <Stack spacing={1}>{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={52} />)}</Stack>
      ) : (
        <AppTable columns={columns} rows={items} emptyMessage="No low-stock items — all products well-stocked! 🎉" />
      )}

      <AppPagination
        page={page}
        count={totalPages}
        total={totalElements}
        rowsPerPage={PAGE_SIZE}
        onPageChange={(val) => setPage(val)}
      />

      {/* Edit Modal */}
      <AppModal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title={`Update Stock — ${editModal?.productName}`}
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setEditModal(null)}>Cancel</AppButton>
            <AppButton loading={saving} onClick={handleSave}>Save Changes</AppButton>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <AppTextField
            label="Current Stock Quantity"
            type="number"
            value={editFields.stockQty}
            onChange={(e) => setEditFields((p) => ({ ...p, stockQty: Math.max(0, parseInt(e.target.value) || 0) }))}
          />
          <AppTextField
            label="Reorder Level"
            type="number"
            value={editFields.reorderLevel}
            onChange={(e) => setEditFields((p) => ({ ...p, reorderLevel: Math.max(0, parseInt(e.target.value) || 0) }))}
          />
          <Typography variant="caption" color="text.secondary">
            The system will flag this product as low-stock when quantity falls at or below the reorder level.
          </Typography>
        </Stack>
      </AppModal>
    </Box>
  );
}
