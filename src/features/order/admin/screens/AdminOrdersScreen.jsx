import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AppBreadcrumbs, AppButton, AppChip, AppModal, AppPagination, AppSelect, AppTable, AppTextField, PageHeader } from '../../../../components/common';

const initialOrders = [
  { id: 'ORD-2026-001', customer: 'Sarah Johnson', email: 'sarah@example.com', date: 'Mar 28, 2026 10:14 AM', items: 3, total: '$248.50', status: 'Pending' },
  { id: 'ORD-2026-002', customer: 'Mike Chen', email: 'mike@example.com', date: 'Mar 28, 2026 11:32 AM', items: 1, total: '$79.99', status: 'Processing' },
  { id: 'ORD-2026-003', customer: 'Emma Davis', email: 'emma@example.com', date: 'Mar 27, 2026 02:15 PM', items: 2, total: '$149.98', status: 'Shipped' },
  { id: 'ORD-2026-004', customer: 'Carlos Mendoza', email: 'carlos@example.com', date: 'Mar 26, 2026 09:50 AM', items: 4, total: '$320.35', status: 'Delivered' },
  { id: 'ORD-2026-005', customer: 'Priya Kaur', email: 'priya@example.com', date: 'Mar 25, 2026 06:20 PM', items: 1, total: '$49.99', status: 'Cancelled' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: '', email: '', items: 1, total: '', status: 'Pending' });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const lower = search.trim().toLowerCase();
      const matchesSearch =
        !lower ||
        order.id.toLowerCase().includes(lower) ||
        order.customer.toLowerCase().includes(lower) ||
        order.email.toLowerCase().includes(lower);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
  const pagedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items', align: 'center' },
    { key: 'total', label: 'Total', align: 'right' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => <AppChip status={value.toLowerCase()} label={value} />,
    },
  ];

  const handleCreateOrder = () => {
    if (!newOrder.customer || !newOrder.email || !newOrder.total) return;
    const nextId = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    setOrders((prev) => [{ id: nextId, date: new Date().toLocaleString(), ...newOrder }, ...prev]);
    setIsModalOpen(false);
    setNewOrder({ customer: '', email: '', items: 1, total: '', status: 'Pending' });
  };

  return (
    <Box>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Orders' }]} />
      <PageHeader
        title="Order Management"
        subtitle="Track and manage customer orders"
        action={
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <AppButton variant="outlined" color="primary" onClick={() => window.alert('Export not implemented yet')}>
              Export
            </AppButton>
            <AppButton onClick={() => setIsModalOpen(true)}>New Order</AppButton>
          </Stack>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <AppTextField
          label="Search orders"
          placeholder="Search by order id, customer, email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AppSelect
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          options={statusOptions}
          placeholder="Select status"
          sx={{ minWidth: 200 }}
        />
      </Stack>

      <AppTable columns={columns} rows={pagedOrders} emptyMessage="No orders found" />

      <AppPagination
        page={page}
        count={pageCount}
        total={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setPage(1);
        }}
      />

      <AppModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AppButton>
            <AppButton onClick={handleCreateOrder}>Create</AppButton>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <AppTextField
            label="Customer Name"
            value={newOrder.customer}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, customer: e.target.value }))}
          />
          <AppTextField
            label="Email"
            type="email"
            value={newOrder.email}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, email: e.target.value }))}
          />
          <AppTextField
            label="Items"
            type="number"
            value={newOrder.items}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, items: Number(e.target.value) || 1 }))}
          />
          <AppTextField
            label="Total"
            placeholder="$0.00"
            value={newOrder.total}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, total: e.target.value }))}
          />
          <AppSelect
            label="Status"
            value={newOrder.status}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, status: e.target.value }))}
            options={statusOptions.filter((option) => option.value !== 'all')}
          />
        </Stack>
      </AppModal>
    </Box>
  );
}
