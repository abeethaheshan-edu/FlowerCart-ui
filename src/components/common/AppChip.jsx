import Chip from '@mui/material/Chip';

const statusMap = {
  delivered: { label: 'Delivered', color: 'success' },
  shipped: { label: 'Shipped', color: 'info' },
  processing: { label: 'Processing', color: 'warning' },
  pending: { label: 'Pending', color: 'warning' },
  cancelled: { label: 'Cancelled', color: 'error' },
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'default' },
  low: { label: 'Low', color: 'warning' },
  critical: { label: 'Critical', color: 'error' },
  open: { label: 'Open', color: 'error' },
  'in progress': { label: 'In Progress', color: 'warning' },
  resolved: { label: 'Resolved', color: 'success' },
  closed: { label: 'Closed', color: 'default' },
};

export default function AppChip({ status, label, color, size = 'small', sx = {}, ...props }) {
  const mapped = status ? statusMap[status?.toLowerCase()] : null;
  return (
    <Chip
      label={mapped?.label ?? label ?? status}
      color={mapped?.color ?? color ?? 'default'}
      size={size}
      sx={{ fontWeight: 600, ...sx }}
      {...props}
    />
  );
}
