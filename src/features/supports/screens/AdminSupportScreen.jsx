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

const initialTickets = [
  {
    id: 'TCK-2026-001',
    subject: 'Payment gateway issue - checkout failing',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Open',
    priority: 'Critical',
    assignedTo: 'Sarah Wilson',
    createdAt: 'Mar 30, 2026 09:30 AM',
    updatedAt: 'Mar 30, 2026 09:45 AM',
  },
  {
    id: 'TCK-2026-002',
    subject: 'Order not delivered after 10 days',
    customer: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'Arah Wilson',
    createdAt: 'Mar 29, 2026 03:10 PM',
    updatedAt: 'Mar 29, 2026 05:26 PM',
  },
  {
    id: 'TCK-2026-003',
    subject: 'Change shipping address - existing order',
    customer: 'Mike Jones',
    email: 'mike.jones@example.com',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Emma Davis',
    createdAt: 'Mar 28, 2026 02:03 PM',
    updatedAt: 'Mar 28, 2026 02:40 PM',
  },
  {
    id: 'TCK-2026-004',
    subject: 'Product recommendation for home office',
    customer: 'Anna Wilson',
    email: 'anna.wilson@example.com',
    status: 'Resolved',
    priority: 'Low',
    assignedTo: 'Michael Brown',
    createdAt: 'Mar 27, 2026 10:50 AM',
    updatedAt: 'Mar 27, 2026 11:25 AM',
  },
];

const statusOptions = [
  { value: 'all', label: 'All tickets' },
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Resolved', label: 'Resolved' },
];

const priorityOptions = [
  { value: 'all', label: 'All priorities' },
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const agentOptions = [
  { value: 'all', label: 'All agents' },
  { value: 'Sarah Wilson', label: 'Sarah Wilson' },
  { value: 'Arah Wilson', label: 'Arah Wilson' },
  { value: 'Emma Davis', label: 'Emma Davis' },
  { value: 'Michael Brown', label: 'Michael Brown' },
];

const priorityColor = { Critical: 'error', High: 'warning', Medium: 'secondary', Low: 'success' };
const statusColor = { Open: 'error', 'In Progress': 'warning', Pending: 'info', Resolved: 'success' };

export default function AdminSupportScreen() {
  const [tickets, setTickets] = useState(initialTickets);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    customer: '',
    email: '',
    status: 'Open',
    priority: 'Critical',
    assignedTo: 'Sarah Wilson',
  });

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
      const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
      const agentMatch = filterAgent === 'all' || ticket.assignedTo === filterAgent;
      const searchMatch =
        !term ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.customer.toLowerCase().includes(term) ||
        ticket.email.toLowerCase().includes(term) ||
        ticket.id.toLowerCase().includes(term);
      return statusMatch && priorityMatch && agentMatch && searchMatch;
    });
  }, [tickets, filterStatus, filterPriority, filterAgent, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / rowsPerPage));
  const pagedTickets = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredTickets.slice(start, start + rowsPerPage);
  }, [filteredTickets, page, rowsPerPage]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'Open').length;
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
    const resolved = tickets.filter((t) => t.status === 'Resolved').length;
    return { total, open, inProgress, resolved };
  }, [tickets]);

  const columns = [
    {
      key: 'subject',
      label: 'Subject',
      render: (_, ticket) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {ticket.subject}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ticket.customer} • {ticket.email}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      align: 'center',
      render: (value) => <AppChip label={value} status={priorityColor[value] || 'default'} />,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (value) => <AppChip label={value} status={statusColor[value] || 'default'} />,
    },
    { key: 'assignedTo', label: 'Assigned to', align: 'center' },
    { key: 'createdAt', label: 'Created', align: 'center' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, ticket) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <AppButton size="small" variant="outlined" onClick={() => alert(`Ticket details: ${ticket.id}`)}>
            View
          </AppButton>
          <AppButton
            size="small"
            color="error"
            variant="outlined"
            onClick={() => setTickets((prev) => prev.filter((t) => t.id !== ticket.id))}
          >
            Close
          </AppButton>
        </Stack>
      ),
    },
  ];

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.customer || !newTicket.email) return;
    setTickets((prev) => [
      {
        id: `TCK-${String(prev.length + 1).padStart(6, '0')}`,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        ...newTicket,
      },
      ...prev,
    ]);
    setIsModalOpen(false);
    setNewTicket({
      subject: '',
      customer: '',
      email: '',
      status: 'Open',
      priority: 'Critical',
      assignedTo: 'Sarah Wilson',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Support' }]} />

      <PageHeader
        title="Support Tickets"
        subtitle="Manage customer requests and inquiries"
        action={
          <AppButton onClick={() => setIsModalOpen(true)}>+ Create Ticket</AppButton>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, gap: 1.25, mb: 2 }}>
        <StatCard label="Total Tickets" value={stats.total} />
        <StatCard label="Open" value={stats.open} trend={`${stats.open} active`} trendPositive={false} />
        <StatCard label="In Progress" value={stats.inProgress} trend={`${stats.inProgress} running`} />
        <StatCard label="Resolved" value={stats.resolved} trend="+99%" trendPositive />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <AppTextField
          label="Search tickets"
          placeholder="Search by id, subject, customer, email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <AppSelect
          label="Status"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          options={statusOptions}
          sx={{ minWidth: 180 }}
        />
        <AppSelect
          label="Priority"
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
          options={priorityOptions}
          sx={{ minWidth: 180 }}
        />
        <AppSelect
          label="Assigned to"
          value={filterAgent}
          onChange={(e) => {
            setFilterAgent(e.target.value);
            setPage(1);
          }}
          options={agentOptions}
          sx={{ minWidth: 180 }}
        />
      </Stack>

      <AppTable columns={columns} rows={pagedTickets} emptyMessage="No tickets found" />

      <AppPagination
        page={page}
        count={totalPages}
        total={filteredTickets.length}
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
        title="New Support Ticket"
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AppButton>
            <AppButton onClick={handleCreateTicket}>Create Ticket</AppButton>
          </Stack>
        }
      >
        <Stack spacing={1}>
          <AppTextField
            label="Subject"
            value={newTicket.subject}
            onChange={(e) => setNewTicket((p) => ({ ...p, subject: e.target.value }))}
          />
          <AppTextField
            label="Customer"
            value={newTicket.customer}
            onChange={(e) => setNewTicket((p) => ({ ...p, customer: e.target.value }))}
          />
          <AppTextField
            label="Email"
            type="email"
            value={newTicket.email}
            onChange={(e) => setNewTicket((p) => ({ ...p, email: e.target.value }))}
          />
          <AppSelect
            label="Status"
            value={newTicket.status}
            onChange={(e) => setNewTicket((p) => ({ ...p, status: e.target.value }))}
            options={statusOptions.filter((o) => o.value !== 'all')}
          />
          <AppSelect
            label="Priority"
            value={newTicket.priority}
            onChange={(e) => setNewTicket((p) => ({ ...p, priority: e.target.value }))}
            options={priorityOptions.filter((o) => o.value !== 'all')}
          />
          <AppSelect
            label="Assign to"
            value={newTicket.assignedTo}
            onChange={(e) => setNewTicket((p) => ({ ...p, assignedTo: e.target.value }))}
            options={agentOptions.filter((o) => o.value !== 'all')}
          />
        </Stack>
      </AppModal>
    </Box>
  );
}
