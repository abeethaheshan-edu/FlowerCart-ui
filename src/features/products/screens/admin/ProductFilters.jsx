import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import AppTextField from '../../../../components/common/AppTextField';
import AppButton from '../../../../components/common/AppButton';

function PillButton({ label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2.5, py: 1, borderRadius: 50, cursor: 'pointer',
        bgcolor: active ? 'primary.main' : '#f4f4f5',
        color: active ? '#fff' : 'text.primary',
        fontWeight: 600, fontSize: '0.85rem',
        border: '1.5px solid',
        borderColor: active ? 'primary.main' : '#e5e7eb',
        transition: 'all 0.15s',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        '&:hover': { borderColor: 'primary.main', color: active ? '#fff' : 'primary.main' },
      }}
    >
      {label}
    </Box>
  );
}

export default function ProductFilters({
  search, onSearchChange,
  categoryFilter, onCategoryChange, categories,
  statusFilter, onStatusChange,
  onExport, onAddProduct,
}) {
  const categoryLabel = categoryFilter
    ? (categories.find((c) => String(c.categoryId) === String(categoryFilter))?.name ?? 'Category')
    : 'All Categories';

  const statusLabel = statusFilter || 'All Status';

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
      bgcolor: 'background.paper', borderRadius: 3,
      border: '1px solid', borderColor: 'divider', p: 2, mb: 2,
    }}>
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <AppTextField
          placeholder="Search products..."
          value={search}
          size="small"
          onChange={(e) => onSearchChange(e.target.value)}
          startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>}
          sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        />
      </Box>

      <PillButton
        label={categoryLabel}
        active={!!categoryFilter}
        onClick={() => onCategoryChange(categoryFilter ? '' : (categories[0]?.categoryId ?? ''))}
      />

      <PillButton
        label={statusLabel}
        active={!!statusFilter}
        onClick={() => onStatusChange(statusFilter ? '' : 'ACTIVE')}
      />

      <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <AppButton
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={onExport}
          sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2, fontWeight: 600 }}
        >
          Export
        </AppButton>
        <AppButton
          startIcon={<AddIcon />}
          onClick={onAddProduct}
          sx={{
            bgcolor: 'primary.main', color: '#fff', borderRadius: 2, fontWeight: 700,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Add Product
        </AppButton>
      </Box>
    </Box>
  );
}
