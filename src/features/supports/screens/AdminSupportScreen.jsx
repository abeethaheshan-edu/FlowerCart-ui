import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppChip from '../../../components/common/AppChip';
import AppModal from '../../../components/common/AppModal';
import AppPagination from '../../../components/common/AppPagination';
import AppSelect from '../../../components/common/AppSelect';
import AppTable from '../../../components/common/AppTable';
import PageHeader from '../../../components/common/PageHeader';
import { supportService } from '../services/supportService';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const PAGE_SIZE = 20;

export default function AdminSupportScreen() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [updating, setUpdating] = useState(null);

  const loadTickets = useCallback(() => {
    setLoading(true);
    supportService.getAdminTickets({ status: statusFilter || undefined, page: page - 1, size: PAGE_SIZE })
      .then((paged) => {
        setTickets(paged.data ?? []);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load support tickets.'))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdating(ticketId);
    try {
      const updated = await supportService.updateTicketStatus(ticketId, newStatus);
      setTickets((prev) => prev.map((t) => t.ticketId === updated.ticketId ? updated : t));
      if (detailModal?.ticketId === updated.ticketId) setDetailModal(updated);
    } catch (err) {
      setError(err.message || 'Failed to update ticket status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleAssign = async (ticketId) => {
    setUpdating(ticketId);
    try {
      const updated = await supportService.assignTicket(ticketId);
      setTickets((prev) => prev.map((t) => t.ticketId === updated.ticketId ? updated : t));
      if (detailModal?.ticketId === updated.ticketId) setDetailModal(updated);
    } catch (err) {
      setError(err.message || 'Failed to assign ticket.');
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    {
      key: 'ticketId', label: 'Ticket',
      render: (v, row) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>#{v}</Typography>
          <Typography variant="caption" color="text.secondary">{row.subject}</Typography>
        </Box>
      ),
    },
    { key: 'createdByName', label: 'Customer' },
    {
      key: 'priority', label: 'Priority', align: 'center',
      render: (v) => <AppChip status={v?.toLowerCase()} label={v} />,
    },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (v) => <AppChip status={v?.toLowerCase().replace('_', '-')} label={v?.replace('_', ' ')} />,
    },
    {
      key: 'assignedToName', label: 'Assigned To',
      render: (v) => v || <Typography variant="caption" color="text.secondary">Unassigned</Typography>,
    },
    {
      key: 'createdAt', label: 'Created',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—',
    },
    {
      key: 'actions', label: '', align: 'right',
      render: (_, row) => (
        <AppButton size="small" variant="outlined" onClick={() => setDetailModal(row)}>View</AppButton>
      ),
    },
  ];

  const nextStatuses = {
    OPEN: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    IN_PROGRESS: ['RESOLVED', 'CLOSED'],
    RESOLVED: ['CLOSED'],
    CLOSED: [],
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Support' }]} />

      <PageHeader
        title="Support Tickets"
        subtitle={`${totalElements} total tickets`}
        action={<AppButton variant="outlined" onClick={loadTickets}>Refresh</AppButton>}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <AppSelect
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          options={STATUS_OPTIONS}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {loading
        ? <Stack spacing={1}>{[1, 2, 3, 4].map((i) => <Skeleton key={i} height={52} />)}</Stack>
        : <AppTable columns={columns} rows={tickets} emptyMessage="No support tickets found" />
      }

      <AppPagination
        page={page}
        count={totalPages}
        total={totalElements}
        rowsPerPage={PAGE_SIZE}
        onPageChange={(val) => setPage(val)}
      />

      {/* Ticket Detail */}
      {detailModal && (
        <AppModal
          open={!!detailModal}
          onClose={() => setDetailModal(null)}
          title={`Ticket #${detailModal.ticketId} — ${detailModal.subject}`}
          actions={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {!detailModal.assignedToUserId && (
                <AppButton size="small" variant="outlined" loading={updating === detailModal.ticketId} onClick={() => handleAssign(detailModal.ticketId)}>
                  Assign to Me
                </AppButton>
              )}
              {(nextStatuses[detailModal.status] ?? []).map((s) => (
                <AppButton
                  key={s}
                  size="small"
                  loading={updating === detailModal.ticketId}
                  onClick={() => handleUpdateStatus(detailModal.ticketId, s)}
                >
                  {s.replace('_', ' ')}
                </AppButton>
              ))}
              <AppButton variant="outlined" onClick={() => setDetailModal(null)}>Close</AppButton>
            </Stack>
          }
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Customer</Typography>
                <Typography variant="body2" fontWeight={600}>{detailModal.createdByName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Priority</Typography>
                <Box><AppChip status={detailModal.priority?.toLowerCase()} label={detailModal.priority} /></Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight={600}>{detailModal.category || '—'}</Typography>
              </Box>
              {detailModal.assignedToName && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                  <Typography variant="body2" fontWeight={600}>{detailModal.assignedToName}</Typography>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Messages */}
            <Typography variant="subtitle2" fontWeight={700}>Conversation</Typography>
            <Stack spacing={1.5} sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {(detailModal.messages ?? []).map((msg) => (
                <Box
                  key={msg.messageId}
                  sx={{
                    p: 1.5, borderRadius: 2,
                    bgcolor: msg.senderType === 'ADMIN' ? 'primary.main' : 'action.hover',
                    color: msg.senderType === 'ADMIN' ? 'primary.contrastText' : 'text.primary',
                    alignSelf: msg.senderType === 'ADMIN' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ width: 20, height: 20, fontSize: 11 }}>
                      {(msg.senderName || 'U')[0]}
                    </Avatar>
                    <Typography variant="caption" fontWeight={700}>{msg.senderName}</Typography>
                  </Box>
                  <Typography variant="body2">{msg.messageText}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                  </Typography>
                </Box>
              ))}
              {(detailModal.messages ?? []).length === 0 && (
                <Typography variant="body2" color="text.secondary">No messages yet.</Typography>
              )}
            </Stack>
          </Stack>
        </AppModal>
      )}
    </Box>
  );
}
