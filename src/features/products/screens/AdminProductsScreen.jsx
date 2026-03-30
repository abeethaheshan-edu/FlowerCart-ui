import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AppButton from '../../../components/common/AppButton';
import AppTextField from '../../../components/common/AppTextField';
import AppTable from '../../../components/common/AppTable';
import AppSelect from '../../../components/common/AppSelect';
import PageHeader from '../../../components/common/PageHeader';

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones Pro', sku: 'WH-PRO-001', category: 'Electronics', price: '$299.99', stock: 24 },
  { id: 2, name: 'iPhone 15 Pro Max', sku: 'IP-15PM-256', category: 'Electronics', price: '$1,199.99', stock: 3 },
  { id: 3, name: 'MacBook Air M2', sku: 'MBA-M2-512', category: 'Electronics', price: '$1,499.99', stock: 8 },
];

const PRODUCT_COLUMNS = [
  {
    key: 'name',
    label: 'Product',
    render: (v, row) => (
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {v}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          SKU: {row.sku}
        </Typography>
      </Box>
    ),
  },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock', align: 'center' },
  {
    key: 'actions',
    label: 'Actions',
    align: 'right',
    render: () => (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <AppButton size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />}>
          View
        </AppButton>
        <AppButton size="small" variant="outlined" startIcon={<EditOutlinedIcon />}>
          Edit
        </AppButton>
        <AppButton size="small" color="error" variant="outlined" startIcon={<DeleteOutlineIcon />}>
          Delete
        </AppButton>
      </Box>
    ),
  },
];

export default function AdminProductsScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All Categories' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Header */}
      <PageHeader
        title="Product Management"
        subtitle="Manage your product catalog and inventory"
        action={
          <AppButton startIcon={<AddIcon />} variant="contained">
            Add Product
          </AppButton>
        }
      />

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <AppTextField placeholder="Search products..." fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppSelect
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { label: 'All Categories', value: 'All Categories' },
              { label: 'Electronics', value: 'Electronics' },
              { label: 'Accessories', value: 'Accessories' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <AppButton startIcon={<FileDownloadOutlinedIcon />} variant="outlined">
            Export
          </AppButton>
        </Grid>
      </Grid>

      {/* Table */}
      <AppTable columns={PRODUCT_COLUMNS} rows={filteredProducts} />
    </Box>
  );
}
