import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TagIcon from '@mui/icons-material/Tag';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppModal from '../../../components/common/AppModal';
import AppTextField from '../../../components/common/AppTextField';
import AppSelect from '../../../components/common/AppSelect';
import { supportService } from '../services/supportService';
import { authService } from '../../auth/services/authService';

const CATEGORIES = ['Shipping', 'Payment', 'Product', 'Returns', 'Account', 'Other'];

const STATUS_FILTER = [
  { key: 'OPEN',        label: 'Open',        color: '#ef4444' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: '#f59e0b' },
  { key: 'RESOLVED',    label: 'Resolved',    color: '#22c55e' },
  { key: 'CLOSED',      label: 'Closed',      color: '#9ca3af' },
];

const PRIORITY_FILTER = [
  { key: 'HIGH',   color: '#ef4444' },
  { key: 'MEDIUM', color: '#f59e0b' },
  { key: 'LOW',    color: '#22c55e' },
];

const PRIORITY_ICON_COLOR = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e', URGENT: '#ef4444' };
const PRIORITY_ICON_BG    = { HIGH: '#fef2f2', MEDIUM: '#fffbeb', LOW: '#f0fdf4', URGENT: '#fef2f2' };

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)     return 'just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function PriorityDot({ priority }) {
  return (
    <Box sx={{
      width: 8, height: 8, borderRadius: '50%',
      bgcolor: PRIORITY_ICON_COLOR[priority?.toUpperCase()] ?? '#9ca3af',
      flexShrink: 0,
    }} />
  );
}

function TicketCard({ ticket }) {
  const statusColors = {
    OPEN: { bg: '#fef2f2', color: '#ef4444', text: 'Open' },
    IN_PROGRESS: { bg: '#fffbeb', color: '#d97706', text: 'In Progress' },
    RESOLVED: { bg: '#f0fdf4', color: '#16a34a', text: 'Resolved' },
    CLOSED: { bg: '#f9fafb', color: '#6b7280', text: 'Closed' },
  };
  const s = statusColors[ticket.status] ?? statusColors.OPEN;
  const isHigh   = ticket.priority === 'HIGH' || ticket.priority === 'URGENT';
  const isMedium = ticket.priority === 'MEDIUM';

  return (
    <Box sx={{
      bgcolor: 'background.paper', borderRadius: 3,
      border: '1px solid', borderColor: 'divider', p: 3, mb: 2,
    }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          bgcolor: PRIORITY_ICON_BG[ticket.priority?.toUpperCase()] ?? '#f9fafb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isHigh   ? <PriorityHighIcon sx={{ fontSize: 18, color: '#ef4444' }} /> :
           isMedium ? <AccessTimeIcon sx={{ fontSize: 18, color: '#f59e0b' }} /> :
                      <HelpOutlineIcon sx={{ fontSize: 18, color: '#22c55e' }} />}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.8 }}>
            <Typography fontWeight={800} sx={{ lineHeight: 1.3 }}>{ticket.subject}</Typography>
            <Box sx={{
              px: 1.2, py: 0.3, borderRadius: 50, flexShrink: 0,
              bgcolor: isHigh ? '#fef2f2' : isMedium ? '#fffbeb' : '#f0fdf4',
            }}>
              <Typography variant="caption" fontWeight={700}
                sx={{ color: isHigh ? '#ef4444' : isMedium ? '#d97706' : '#16a34a' }}>
                {isHigh ? '● High Priority' : isMedium ? '● Medium Priority' : '● Low Priority'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {(ticket.messages?.[0]?.messageText ?? '').slice(0, 180)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Ticket:</Typography>
              <Typography variant="caption" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                TKT-{String(ticket.ticketId).padStart(3,'0')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Status:</Typography>
              <Box sx={{ px: 1, py: 0.1, borderRadius: 50, bgcolor: s.bg }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: s.color }}>{s.text}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Created:</Typography>
              <Typography variant="caption" fontWeight={600}>{timeAgo(ticket.createdAt)}</Typography>
            </Box>
            {ticket.category && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Category:</Typography>
                <Typography variant="caption" fontWeight={600}>{ticket.category}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CreateTicketModal({ open, onClose, onCreated }) {
  const [form, setForm]     = useState({ subject: '', message: '', category: '', priority: 'MEDIUM' });
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) { setErr('Subject and message are required.'); return; }
    setSaving(true);
    try {
      const ticket = await supportService.createTicket(form);
      onCreated(ticket);
      setForm({ subject: '', message: '', category: '', priority: 'MEDIUM' });
      onClose();
    } catch (e) {
      setErr(e.message || 'Failed to create ticket.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Create Support Ticket"
      maxWidth="sm"
      actions={
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <AppButton variant="outlined" onClick={onClose} sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}>
            Cancel
          </AppButton>
          <AppButton loading={saving} onClick={handleSubmit}
            sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#C94375' } }}>
            Create Ticket
          </AppButton>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        {err && <Alert severity="error" onClose={() => setErr('')}>{err}</Alert>}
        <AppTextField label="Subject *" value={form.subject} onChange={set('subject')}
          placeholder="Brief description of your issue" size="small" />
        <AppTextField label="Message *" value={form.message} onChange={set('message')}
          placeholder="Describe your issue in detail..." multiline rows={4} size="small" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <AppSelect label="Category" value={form.category} onChange={set('category')} size="small"
              options={[{ value: '', label: 'Select category' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
            />
          </Grid>
          <Grid item xs={6}>
            <AppSelect label="Priority" value={form.priority} onChange={set('priority')} size="small"
              options={[
                { value: 'LOW',    label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH',   label: 'High' },
              ]}
            />
          </Grid>
        </Grid>
      </Stack>
    </AppModal>
  );
}

export default function CustomerHelpDeskScreen() {
  const navigate = useNavigate();
  const [tickets,       setTickets]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState([]);
  const [priorityFilter,setPriorityFilter]= useState([]);
  const [category,      setCategory]      = useState('');
  const [createOpen,    setCreateOpen]    = useState(false);
  const [sortAsc,       setSortAsc]       = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setLoading(true);
    supportService.getMyTickets({ page: 0, size: 50 })
      .then((paged) => setTickets(paged.data ?? []))
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleStatus   = (key) => setStatusFilter((p) => p.includes(key) ? p.filter((x) => x !== key) : [...p, key]);
  const togglePriority = (key) => setPriorityFilter((p) => p.includes(key) ? p.filter((x) => x !== key) : [...p, key]);

  const statusCounts = STATUS_FILTER.reduce((acc, s) => {
    acc[s.key] = tickets.filter((t) => t.status === s.key).length;
    return acc;
  }, {});

  const filtered = tickets
    .filter((t) => {
      if (statusFilter.length   && !statusFilter.includes(t.status))   return false;
      if (priorityFilter.length && !priorityFilter.includes(t.priority)) return false;
      if (category && t.category !== category) return false;
      if (search.trim() && !t.subject?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt), db = new Date(b.createdAt);
      return sortAsc ? da - db : db - da;
    });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/account' }, { label: 'Help Desk' }]} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={900}>Help Desk</Typography>
            <Typography variant="body2" color="text.secondary">Get help with your orders, account, and shopping experience</Typography>
          </Box>
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ bgcolor: '#E85D8E', color: '#fff', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#C94375' } }}
          >
            Create Ticket
          </AppButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

        <Grid container spacing={3}>
          {/* Filter sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
              <Typography fontWeight={800} sx={{ mb: 2 }}>Filter Tickets</Typography>

              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.2, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                Status
              </Typography>
              {STATUS_FILTER.map((s) => (
                <Box key={s.key} onClick={() => toggleStatus(s.key)}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6, cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 16, height: 16, border: '1.5px solid',
                      borderColor: statusFilter.includes(s.key) ? 'primary.main' : 'divider',
                      borderRadius: 0.5, bgcolor: statusFilter.includes(s.key) ? 'primary.main' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {statusFilter.includes(s.key) && <Box sx={{ width: 8, height: 8, bgcolor: '#fff', borderRadius: 0.3 }} />}
                    </Box>
                    <Typography variant="body2">{s.label}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{statusCounts[s.key] ?? 0}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.2, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                Priority
              </Typography>
              {PRIORITY_FILTER.map((p) => (
                <Box key={p.key} onClick={() => togglePriority(p.key)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.6, cursor: 'pointer' }}>
                  <Box sx={{
                    width: 16, height: 16, border: '1.5px solid',
                    borderColor: priorityFilter.includes(p.key) ? 'primary.main' : 'divider',
                    borderRadius: 0.5, bgcolor: priorityFilter.includes(p.key) ? 'primary.main' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {priorityFilter.includes(p.key) && <Box sx={{ width: 8, height: 8, bgcolor: '#fff', borderRadius: 0.3 }} />}
                  </Box>
                  <Typography variant="body2">{p.key.charAt(0) + p.key.slice(1).toLowerCase()}</Typography>
                  <PriorityDot priority={p.key} />
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.2, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                Category
              </Typography>
              <Box
                onClick={() => setCategory('')}
                sx={{
                  px: 1.5, py: 0.8, borderRadius: 2, cursor: 'pointer',
                  bgcolor: category === '' ? '#f3f4f6' : 'transparent',
                  border: '1px solid', borderColor: category === '' ? 'divider' : 'transparent',
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">All Categories</Typography>
              </Box>
              {CATEGORIES.map((c) => (
                <Box key={c} onClick={() => setCategory(category === c ? '' : c)}
                  sx={{
                    px: 1.5, py: 0.6, borderRadius: 2, cursor: 'pointer', mb: 0.3,
                    bgcolor: category === c ? 'primary.light' : 'transparent',
                    '&:hover': { bgcolor: category === c ? 'primary.light' : 'action.hover' },
                  }}>
                  <Typography variant="body2" sx={{ color: category === c ? 'primary.dark' : 'text.primary' }}>{c}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Ticket list */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'center' }}>
              <TextField
                size="small" placeholder="Search tickets..." value={search}
                onChange={(e) => setSearch(e.target.value)} fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment> } }}
              />
              <AppButton
                variant="outlined"
                startIcon={<SortByAlphaIcon />}
                onClick={() => setSortAsc((v) => !v)}
                sx={{ flexShrink: 0, borderColor: 'divider', color: 'text.secondary', borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                {sortAsc ? 'Oldest' : 'Sort by Date'}
              </AppButton>
            </Box>

            {loading ? (
              [1,2,3].map((i) => (
                <Box key={i} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="circular" width={36} height={36} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" height={22} />
                      <Skeleton width="80%" height={16} sx={{ mt: 0.8 }} />
                      <Skeleton width="50%" height={14} sx={{ mt: 1.2 }} />
                    </Box>
                  </Box>
                </Box>
              ))
            ) : filtered.length === 0 ? (
              <Box sx={{
                textAlign: 'center', py: 10, bgcolor: 'background.paper',
                borderRadius: 3, border: '1px solid', borderColor: 'divider',
              }}>
                <HelpOutlineIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No tickets found</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {tickets.length === 0 ? "You haven't created any support tickets yet." : 'No tickets match your filters.'}
                </Typography>
                <AppButton
                  startIcon={<AddIcon />}
                  onClick={() => setCreateOpen(true)}
                  sx={{ bgcolor: '#E85D8E', color: '#fff', borderRadius: 50, px: 4, '&:hover': { bgcolor: '#C94375' } }}
                >
                  Create Ticket
                </AppButton>
              </Box>
            ) : (
              filtered.map((ticket) => <TicketCard key={ticket.ticketId} ticket={ticket} />)
            )}
          </Grid>
        </Grid>
      </Container>

      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(ticket) => setTickets((prev) => [ticket, ...prev])}
      />
    </Box>
  );
}
