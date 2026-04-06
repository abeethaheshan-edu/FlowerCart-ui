import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppSelect from '../../../components/common/AppSelect';
import AppPagination from '../../../components/common/AppPagination';
import { supportService } from '../services/supportService';

/* ── design tokens ─────────────────────────────────────────── */
const CARD_SX = { bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '12px' };

const PRIORITY_META = {
  URGENT: { bg: '#fef2f2', color: '#ef4444', text: 'Critical', char: '!' },
  HIGH:   { bg: '#fff7ed', color: '#f97316', text: 'High',     char: '!' },
  MEDIUM: { bg: '#fffbeb', color: '#f59e0b', text: 'Medium',   char: '▲' },
  LOW:    { bg: '#f0fdf4', color: '#22c55e', text: 'Low',      char: 'i' },
};

const STATUS_META = {
  OPEN:        { bg: '#fef2f2', color: '#ef4444', text: 'Open' },
  IN_PROGRESS: { bg: '#fffbeb', color: '#d97706', text: 'In Progress' },
  PENDING:     { bg: '#f5f3ff', color: '#7c3aed', text: 'Pending' },
  RESOLVED:    { bg: '#f0fdf4', color: '#16a34a', text: 'Resolved' },
  CLOSED:      { bg: '#f9fafb', color: '#6b7280', text: 'Closed' },
};

const PAGE_SIZE = 10;

const STATUS_OPTS = [
  { value: '',            label: 'All Tickets' },
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
];

const PRIORITY_OPTS = [
  { value: '',       label: 'All Priorities' },
  { value: 'URGENT', label: 'Critical' },
  { value: 'HIGH',   label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW',    label: 'Low' },
];

function timeAgo(d) {
  if (!d) return '';
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)} minutes ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

/* ── Stat tile ─────────────────────────────────────────────── */
function StatTile({ value, label, icon: Icon, iconBg, iconColor }) {
  return (
    <Box sx={{ ...CARD_SX, flex: 1, p: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: '5px', lineHeight: 1.3 }}>{label}</Typography>
      </Box>
      <Box sx={{
        width: 48, height: 48, borderRadius: '10px', flexShrink: 0,
        bgcolor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon sx={{ fontSize: 24, color: iconColor }} />
      </Box>
    </Box>
  );
}

/* ── Priority circle ───────────────────────────────────────── */
function PriorityCircle({ priority }) {
  const m = PRIORITY_META[priority?.toUpperCase()] ?? PRIORITY_META.LOW;
  return (
    <Box sx={{
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      bgcolor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: m.color }}>{m.char}</Typography>
    </Box>
  );
}

/* ── Priority chip ─────────────────────────────────────────── */
function PriorityChip({ priority }) {
  const m = PRIORITY_META[priority?.toUpperCase()] ?? PRIORITY_META.LOW;
  return (
    <Box sx={{ px: '10px', py: '3px', borderRadius: '20px', bgcolor: m.bg, display: 'inline-flex', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.text}</Typography>
    </Box>
  );
}

/* ── Status chip ───────────────────────────────────────────── */
function StatusChip({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.OPEN;
  return (
    <Box sx={{ px: '10px', py: '3px', borderRadius: '20px', bgcolor: m.bg, display: 'inline-flex', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.text}</Typography>
    </Box>
  );
}

/* ── Ticket row ────────────────────────────────────────────── */
function TicketRow({ ticket, selected, onClick }) {
  const firstMsg = ticket.messages?.[0]?.messageText ?? '';
  return (
    <Box onClick={() => onClick(ticket)} sx={{
      px: '24px', py: '18px', cursor: 'pointer',
      borderLeft: '3px solid',
      borderLeftColor: selected ? 'primary.main' : 'transparent',
      bgcolor: selected ? '#fdf2f6' : 'transparent',
      '&:hover': { bgcolor: selected ? '#fdf2f6' : '#fafafa' },
      transition: 'background 0.1s',
    }}>
      <Box sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <PriorityCircle priority={ticket.priority} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Title + chips */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', mb: '5px' }}>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.35 }}>
              {ticket.subject}
            </Typography>
            <Box sx={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <PriorityChip priority={ticket.priority} />
              <StatusChip status={ticket.status} />
            </Box>
          </Box>
          {/* Description */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: '8px', lineHeight: 1.5 }}>
            {firstMsg.slice(0, 100)}{firstMsg.length > 100 ? '…' : ''}
          </Typography>
          {/* Meta row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TagIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                TKT-{String(ticket.ticketId).padStart(3, '0')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PersonOutlineIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{ticket.createdByName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AccessTimeIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{timeAgo(ticket.createdAt)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PersonOutlineIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {ticket.assignedToName ?? 'Unassigned'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Detail panel ──────────────────────────────────────────── */
function DetailPanel({ ticket, onClose, onStatusChange, onAssign, onReply, updating }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try { await onReply(ticket.ticketId, reply); setReply(''); }
    finally { setSending(false); }
  };

  return (
    <Box sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <Box sx={{ px: '20px', py: '14px', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={800} sx={{ fontSize: '0.95rem' }}>Ticket Details</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: '20px', py: '16px' }}>
        {/* Status */}
        <Box sx={{ mb: '16px' }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: '6px' }}>Status</Typography>
          <AppSelect
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.ticketId, e.target.value)}
            options={STATUS_OPTS.filter((o) => o.value)}
            size="small"
          />
        </Box>

        {/* Priority */}
        <Box sx={{ mb: '16px' }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: '6px' }}>Priority</Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', px: '12px', py: '8px', bgcolor: 'background.default' }}>
            <Typography variant="body2">
              {PRIORITY_META[ticket.priority?.toUpperCase()]?.text ?? ticket.priority}
            </Typography>
          </Box>
        </Box>

        {/* Assign to */}
        <Box sx={{ mb: '16px' }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: '6px' }}>Assign to</Typography>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: '8px', px: '12px', py: '8px', bgcolor: 'background.default' }}>
              <Typography variant="body2">{ticket.assignedToName ?? 'Unassigned'}</Typography>
            </Box>
            {!ticket.assignedToUserId && (
              <AppButton size="small" loading={updating} onClick={() => onAssign(ticket.ticketId)}
                sx={{ flexShrink: 0, fontSize: '0.75rem', px: '12px' }}>
                Assign Me
              </AppButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: '16px' }} />

        {/* Customer info */}
        <Typography fontWeight={800} sx={{ fontSize: '0.9rem', mb: '12px' }}>Customer Information</Typography>
        {[
          { label: 'Name:',     value: ticket.createdByName },
          { label: 'Ticket ID:', value: `TKT-${String(ticket.ticketId).padStart(3, '0')}` },
          ...(ticket.category ? [{ label: 'Category:', value: ticket.category }] : []),
          ...(ticket.orderId   ? [{ label: 'Order:',    value: `#${ticket.orderId}` }] : []),
        ].map(({ label, value }) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: '7px' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{value}</Typography>
          </Box>
        ))}

        <Divider sx={{ mb: '16px', mt: '8px' }} />

        {/* Conversation */}
        <Typography fontWeight={800} sx={{ fontSize: '0.9rem', mb: '12px' }}>Conversation</Typography>
        <Stack spacing={1.5} sx={{ mb: '14px' }}>
          {(ticket.messages ?? []).length === 0 && (
            <Typography variant="body2" color="text.secondary">No messages yet.</Typography>
          )}
          {(ticket.messages ?? []).map((msg) => {
            const isSupport = msg.senderType === 'SUPPORT';
            return (
              <Box key={msg.messageId} sx={{
                p: '12px', borderRadius: '8px',
                bgcolor: isSupport ? '#fdf2f6' : '#f8fafc',
                border: '1px solid', borderColor: isSupport ? '#fce4ec' : 'divider',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '5px' }}>
                  <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: isSupport ? 'primary.main' : 'grey.400' }}>
                    {(msg.senderName || 'U')[0]}
                  </Avatar>
                  <Typography variant="caption" fontWeight={700}>{msg.senderName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {timeAgo(msg.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.messageText}</Typography>
              </Box>
            );
          })}
        </Stack>

        {/* Reply box */}
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <TextField
            size="small" fullWidth multiline rows={2}
            placeholder="Type a reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
          />
          <AppButton
            loading={sending} disabled={!reply.trim()} onClick={handleSend}
            sx={{ flexShrink: 0, alignSelf: 'flex-end', fontSize: '0.82rem', px: '16px' }}
          >
            Send
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Main screen ───────────────────────────────────────────── */
export default function AdminSupportScreen() {
  const [tickets,    setTickets]    = useState([]);
  const [stats,      setStats]      = useState(null);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEl,    setTotalEl]    = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [selected,   setSelected]   = useState(null);
  const [search,     setSearch]     = useState('');
  const [statusF,    setStatusF]    = useState('');
  const [priorityF,  setPriorityF]  = useState('');
  const [updating,   setUpdating]   = useState(false);

  const loadTickets = useCallback(() => {
    setLoading(true);
    supportService.getAdminTickets({ status: statusF || undefined, page: page - 1, size: PAGE_SIZE })
      .then((paged) => {
        setTickets(paged.data ?? []);
        setTotalPages(paged.totalPages ?? 1);
        setTotalEl(paged.totalElements ?? 0);
      })
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false));
  }, [page, statusF]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  useEffect(() => {
    supportService.getAdminStats?.()
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      const t = await supportService.updateTicketStatus(id, status);
      setTickets((p) => p.map((x) => x.ticketId === t.ticketId ? t : x));
      if (selected?.ticketId === t.ticketId) setSelected(t);
    } catch (e) { setError(e.message || 'Update failed.'); }
    finally { setUpdating(false); }
  };

  const handleAssign = async (id) => {
    setUpdating(true);
    try {
      const t = await supportService.assignTicket(id);
      setTickets((p) => p.map((x) => x.ticketId === t.ticketId ? t : x));
      if (selected?.ticketId === t.ticketId) setSelected(t);
    } catch (e) { setError(e.message || 'Assign failed.'); }
    finally { setUpdating(false); }
  };

  const handleReply = async (id, msg) => {
    const t = await supportService.replyToTicket(id, msg);
    setTickets((p) => p.map((x) => x.ticketId === t.ticketId ? t : x));
    setSelected(t);
  };

  const filtered = search.trim()
    ? tickets.filter((t) =>
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.createdByName?.toLowerCase().includes(search.toLowerCase()))
    : tickets;

  const statsData = {
    open:          stats?.open          ?? tickets.filter((t) => t.status === 'OPEN').length,
    inProgress:    stats?.inProgress    ?? tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolvedToday: stats?.resolvedToday ?? 0,
    avgRating:     4.8,
  };

  return (
    <Box sx={{ minWidth: 900 }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Support' }]} />

      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '24px' }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Support Tickets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: '2px' }}>
            Manage customer support requests and inquiries
          </Typography>
        </Box>
        <AppButton
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#C94375' } }}
        >
          Create Ticket
        </AppButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* ── Filter bar ── */}
      <Box sx={{ ...CARD_SX, px: '20px', py: '14px', mb: '16px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Status:</Typography>
          <AppSelect
            value={statusF}
            onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
            options={STATUS_OPTS}
            size="small"
            sx={{ minWidth: 140 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Priority:</Typography>
          <AppSelect
            value={priorityF}
            onChange={(e) => { setPriorityF(e.target.value); setPage(1); }}
            options={PRIORITY_OPTS}
            size="small"
            sx={{ minWidth: 150 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Assigned to:</Typography>
          <AppSelect
            value=""
            onChange={() => {}}
            options={[{ value: '', label: 'All Agents' }]}
            size="small"
            sx={{ minWidth: 140 }}
          />
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: '16px' }}>
        <TextField
          size="small"
          placeholder="Search tickets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'background.paper' } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: 'text.secondary' }} /></InputAdornment> } }}
        />
      </Box>

      {/* ── Stat tiles ── */}
      <Box sx={{ display: 'flex', gap: '16px', mb: '16px' }}>
        <StatTile value={statsData.open}          label={`Open\nTickets`}       icon={InboxOutlinedIcon}       iconBg="#fef2f2" iconColor="#ef4444" />
        <StatTile value={statsData.inProgress}    label={`In\nProgress`}        icon={HourglassEmptyIcon}      iconBg="#fffbeb" iconColor="#d97706" />
        <StatTile value={statsData.resolvedToday} label={`Resolved\nToday`}     icon={CheckCircleOutlineIcon}  iconBg="#f0fdf4" iconColor="#16a34a" />
        <StatTile value={statsData.avgRating}     label={`Avg\nRating`}         icon={StarBorderIcon}          iconBg="#f5f3ff" iconColor="#7c3aed" />
      </Box>

      {/* ── Main content: Queue + Details panel ── */}
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        {/* Ticket queue */}
        <Box sx={{ flex: selected ? '0 0 calc(60% - 8px)' : 1, ...CARD_SX, overflow: 'hidden' }}>
          {/* Queue header */}
          <Box sx={{
            px: '24px', py: '14px', borderBottom: '1px solid', borderColor: 'divider',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Typography fontWeight={800} sx={{ fontSize: '0.95rem' }}>Ticket Queue</Typography>
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AppButton variant="outlined" size="small" startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                onClick={loadTickets}
                sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.75rem', py: '3px', px: '10px', minWidth: 0 }}>
                Refresh
              </AppButton>
              <IconButton size="small"><MoreHorizIcon sx={{ fontSize: 18 }} /></IconButton>
            </Box>
          </Box>

          {/* Rows */}
          {loading ? (
            <Box sx={{ p: '16px' }}>
              {[1,2,3,4].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: '14px', py: '16px', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Skeleton variant="circular" width={34} height={34} sx={{ flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton height={18} width="60%" sx={{ mb: '6px' }} />
                    <Skeleton height={14} width="80%" sx={{ mb: '8px' }} />
                    <Skeleton height={12} width="45%" />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: '60px' }}>
              <Typography color="text.secondary">No tickets found</Typography>
            </Box>
          ) : (
            filtered.map((ticket, i) => (
              <Box key={ticket.ticketId}>
                <TicketRow
                  ticket={ticket}
                  selected={selected?.ticketId === ticket.ticketId}
                  onClick={setSelected}
                />
                {i < filtered.length - 1 && <Divider />}
              </Box>
            ))
          )}

          {/* Pagination footer */}
          <Box sx={{
            px: '24px', py: '12px', borderTop: '1px solid', borderColor: 'divider',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Typography variant="caption" color="text.secondary">
              Showing {filtered.length} of {totalEl} tickets
            </Typography>
            <AppPagination
              page={page} count={totalPages} total={totalEl}
              rowsPerPage={PAGE_SIZE} showRowsPerPage={false}
              onPageChange={setPage}
              sx={{ py: 0 }}
            />
          </Box>
        </Box>

        {/* Detail panel */}
        {selected && (
          <Box sx={{ flex: '0 0 calc(40% - 8px)', position: 'sticky', top: 16, maxHeight: 'calc(100vh - 120px)' }}>
            <DetailPanel
              ticket={selected}
              onClose={() => setSelected(null)}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
              onReply={handleReply}
              updating={updating}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
