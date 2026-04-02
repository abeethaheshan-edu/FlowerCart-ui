import { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import {
  AppBreadcrumbs, AppButton, AppChip, AppModal,
  AppPagination, AppSelect, AppTable, AppTextField, PageHeader,
} from '../../../../components/common';
import { orderService } from '../../services/orderService';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PAGE_SIZE = 20;

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    orderService.getAdminOrders({ status: statusFilter || undefined, page: page - 1, size: PAGE_SIZE })
      .then((paged) => {
        setOrders(paged.data ?? []);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Client-side search on current page
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) =>
      String(o.orderId).includes(term) ||
      (o.shippingAddress?.city ?? '').toLowerCase().includes(term)
    );
  }, [orders, search]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      if (detailModal?.orderId === updated.orderId) setDetailModal(updated);
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const columns = [
    { key: 'orderId', label: 'Order ID', render: (v) => <Typography variant="body2" fontWeight={700}>#{v}</Typography> },
    {
      key: 'createdAt', label: 'Date',
      render: (v) => v ? new Date(v).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—',
    },
    { key: 'totalAmount', label: 'Total', align: 'right', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
    { key: 'paymentStatus', label: 'Payment', align: 'center', render: (v) => v ? <AppChip status={v.toLowerCase()} label={v} /> : '—' },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (v) => <AppChip status={v?.toLowerCase()} label={v} />,
    },
    {
      key: 'actions', label: '', align: 'right',
      render: (_, row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <AppButton size="small" variant="outlined" onClick={() => setDetailModal(row)}>View</AppButton>
        </Stack>
      ),
    },
  ];

  const nextStatuses = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  return (
    <Box>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Orders' }]} />
      <PageHeader
        title="Order Management"
        subtitle={`${totalElements} total orders`}
        action={<AppButton variant="outlined" onClick={loadOrders}>Refresh</AppButton>}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <AppTextField
          label="Search orders"
          placeholder="Search by order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AppSelect
          label="Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          options={STATUS_OPTIONS}
          sx={{ minWidth: 200 }}
        />
      </Stack>

      {loading
        ? <Stack spacing={1}>{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={52} />)}</Stack>
        : <AppTable columns={columns} rows={filteredOrders} emptyMessage="No orders found" />
      }

      <AppPagination
        page={page}
        count={totalPages}
        total={totalElements}
        rowsPerPage={PAGE_SIZE}
        onPageChange={(val) => setPage(val)}
      />

      {/* Order Detail Modal */}
      {detailModal && (
        <AppModal
          open={!!detailModal}
          onClose={() => setDetailModal(null)}
          title={`Order #${detailModal.orderId}`}
          actions={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(nextStatuses[detailModal.status] ?? []).map((s) => (
                <AppButton
                  key={s}
                  size="small"
                  loading={updatingStatus === detailModal.orderId}
                  onClick={() => handleStatusUpdate(detailModal.orderId, s)}
                >
                  Mark as {s}
                </AppButton>
              ))}
              <AppButton variant="outlined" onClick={() => setDetailModal(null)}>Close</AppButton>
            </Stack>
          }
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Box><AppChip status={detailModal.status?.toLowerCase()} label={detailModal.status} /></Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Payment</Typography>
                <Box><AppChip status={detailModal.paymentStatus?.toLowerCase()} label={detailModal.paymentStatus || 'N/A'} /></Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {detailModal.createdAt ? new Date(detailModal.createdAt).toLocaleString() : '—'}
                </Typography>
              </Box>
            </Box>

            {detailModal.shippingAddress && (
              <Box>
                <Typography variant="caption" color="text.secondary">Shipping To</Typography>
                <Typography variant="body2">{detailModal.shippingAddress.fullAddress}</Typography>
              </Box>
            )}

            <Divider />

            {/* Order items */}
            {(detailModal.orderItems ?? []).map((item) => (
              <Box key={item.orderItemId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{item.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">Qty: {item.quantity} × ${parseFloat(item.unitPrice || 0).toFixed(2)}</Typography>
                </Box>
                <Typography fontWeight={700}>${parseFloat(item.lineTotal || 0).toFixed(2)}</Typography>
              </Box>
            ))}

            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={800} color="primary.main">
                ${parseFloat(detailModal.totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </AppModal>
      )}
    </Box>
  );
}
