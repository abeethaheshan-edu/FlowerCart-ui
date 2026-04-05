import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AppTableEmpty } from '../../../../components/common/AppTable';
import ProductStockCell from './ProductStockCell';
import bannerImg from '../../../../assets/flower-bouquet.png';

const COLUMN_HEADERS = [
  { id: 'check',    label: '',          width: 48 },
  { id: 'product',  label: 'Product',   width: 'auto' },
  { id: 'category', label: 'Category',  width: 130 },
  { id: 'price',    label: 'Price',     width: 140 },
  { id: 'stock',    label: 'Stock',     width: 130 },
  { id: 'status',   label: 'Status',    width: 90 },
  { id: 'actions',  label: 'Actions',   width: 110 },
];

function TableSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton width={18} height={18} variant="rectangular" /></TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton width={44} height={44} variant="rounded" />
          <Box><Skeleton width={140} /><Skeleton width={80} height={12} /></Box>
        </Box>
      </TableCell>
      {[1,2,3,4,5].map((j) => <TableCell key={j}><Skeleton width="70%" /></TableCell>)}
    </TableRow>
  ));
}

function ProductRow({ product, selected, onSelect, onView, onEdit, onDelete, onToggleStatus, onStockChange }) {
  return (
    <TableRow
      hover
      selected={selected}
      sx={{ '&:last-child td': { border: 0 }, '& td': { py: 1.6 } }}
    >
      <TableCell padding="checkbox" sx={{ pl: 2 }}>
        <Checkbox
          size="small"
          checked={selected}
          onChange={() => onSelect(product.productId)}
          sx={{ '&.Mui-checked': { color: 'primary.main' } }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src={product.primaryImageUrl || bannerImg}
            alt={product.name}
            sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', border: '1px solid', borderColor: 'divider', flexShrink: 0 }}
          />
          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>{product.name}</Typography>
            <Typography variant="caption" color="text.secondary">SKU: {product.sku || '—'}</Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{product.categoryName || '—'}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight={700}>{product.formattedPrice}</Typography>
        {product.costPrice != null && (
          <Typography variant="caption" color="text.secondary">Cost: ${Number(product.costPrice).toFixed(2)}</Typography>
        )}
      </TableCell>

      <TableCell>
        <ProductStockCell product={product} onStockChange={onStockChange} />
      </TableCell>

      <TableCell>
        <Switch
          checked={product.status === 'ACTIVE'}
          onChange={() => onToggleStatus(product)}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'primary.main' },
          }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => onView(product)} title="View" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(product)} title="Edit" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(product)} title="Delete" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function ProductTable({
  products, loading, selectedIds,
  onSelectOne, onSelectAll,
  onView, onEdit, onDelete, onToggleStatus, onStockChange,
}) {
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const indeterminate = selectedIds.size > 0 && selectedIds.size < products.length;

  return (
    <TableContainer sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.82rem', color: 'text.secondary', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 1.8 } }}>
            <TableCell padding="checkbox" sx={{ pl: 2, width: 48 }}>
              <Checkbox
                size="small"
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={() => onSelectAll()}
                sx={{ '&.Mui-checked': { color: 'primary.main' }, '&.MuiCheckbox-indeterminate': { color: 'primary.main' } }}
              />
            </TableCell>
            {COLUMN_HEADERS.slice(1).map((col) => (
              <TableCell key={col.id} sx={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableSkeleton />
          ) : products.length === 0 ? (
            <AppTableEmpty message="No products found. Try adjusting your filters." colSpan={7} />
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.productId}
                product={product}
                selected={selectedIds.has(product.productId)}
                onSelect={onSelectOne}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onStockChange={onStockChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
