import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppChip from '../../../components/common/AppChip';
import AppModal from '../../../components/common/AppModal';
import AppPagination from '../../../components/common/AppPagination';
import AppSelect from '../../../components/common/AppSelect';
import AppTable from '../../../components/common/AppTable';
import AppTextField from '../../../components/common/AppTextField';
import PageHeader from '../../../components/common/PageHeader';
import { productService } from '../services/productService';
import { ProductCreateModel } from '../models/ProductModels';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const PAGE_SIZE = 20;

const EMPTY_FORM = {
  name: '', description: '', sku: '', price: '',
  categoryId: '', brandId: '', stockQty: 0, reorderLevel: 5,
  imageUrls: '', primaryImageUrl: '', status: 'ACTIVE',
};

export default function AdminProductsScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formModal, setFormModal] = useState(null); // null | 'create' | ProductModel
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(() => {
    setLoading(true);
    const fn = search.trim()
      ? productService.searchProducts(search.trim(), { page: page - 1, size: PAGE_SIZE })
      : productService.getAdminProducts({ page: page - 1, size: PAGE_SIZE });
    fn
      .then((paged) => {
        setProducts(paged.data ?? []);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
    productService.getBrands().then(setBrands).catch(() => {});
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormModal('create');
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      categoryId: product.categoryId ?? '',
      brandId: product.brandId ?? '',
      stockQty: product.stockQty,
      reorderLevel: product.reorderLevel,
      imageUrls: (product.imageUrls ?? []).join(', '),
      primaryImageUrl: product.primaryImageUrl ?? '',
      status: product.status,
    });
    setFormModal(product);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      setError('Name, price, and category are required.');
      return;
    }
    setSaving(true);
    const body = new ProductCreateModel({
      ...form,
      price: parseFloat(form.price),
      categoryId: parseInt(form.categoryId),
      brandId: form.brandId ? parseInt(form.brandId) : null,
      imageUrls: form.imageUrls ? form.imageUrls.split(',').map((u) => u.trim()).filter(Boolean) : [],
    });
    try {
      if (formModal === 'create') {
        await productService.createProduct(body);
      } else {
        await productService.updateProduct(formModal.productId, body);
      }
      setFormModal(null);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget.productId);
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Product',
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.sku} • {row.categoryName}
          </Typography>
        </Box>
      ),
    },
    { key: 'price', label: 'Price', align: 'right', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
    { key: 'stockQty', label: 'Stock', align: 'center' },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (v) => <AppChip status={v?.toLowerCase()} label={v} />,
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (_, row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <AppButton size="small" variant="outlined" onClick={() => openEdit(row)}>Edit</AppButton>
          <AppButton size="small" color="error" variant="outlined" onClick={() => setDeleteTarget(row)}>Delete</AppButton>
        </Stack>
      ),
    },
  ];

  const catOptions = [{ value: '', label: 'Select Category' }, ...categories.map((c) => ({ value: c.categoryId, label: c.name }))];
  const brandOptions = [{ value: '', label: 'No Brand' }, ...brands.map((b) => ({ value: b.brandId, label: b.name }))];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Products' }]} />

      <PageHeader
        title="Products"
        subtitle={`${totalElements} products`}
        action={
          <Stack direction="row" spacing={1}>
            <AppButton variant="outlined" onClick={loadProducts}>Refresh</AppButton>
            <AppButton onClick={openCreate}>Add Product</AppButton>
          </Stack>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <AppTextField
          label="Search products"
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          endAdornment={<InputAdornment position="end"><SearchIcon fontSize="small" /></InputAdornment>}
        />
      </Box>

      {loading
        ? <Stack spacing={1}>{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={52} />)}</Stack>
        : <AppTable columns={columns} rows={products} emptyMessage="No products found" />
      }

      <AppPagination
        page={page}
        count={totalPages}
        total={totalElements}
        rowsPerPage={PAGE_SIZE}
        onPageChange={(val) => setPage(val)}
      />

      {/* Create / Edit Modal */}
      <AppModal
        open={!!formModal}
        onClose={() => setFormModal(null)}
        title={formModal === 'create' ? 'Add Product' : `Edit — ${formModal?.name}`}
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setFormModal(null)}>Cancel</AppButton>
            <AppButton loading={saving} onClick={handleSave}>
              {formModal === 'create' ? 'Create' : 'Save Changes'}
            </AppButton>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <AppTextField label="Product Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <AppTextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <Stack direction="row" spacing={2}>
            <AppTextField label="SKU" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
            <AppTextField label="Price ($) *" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
          </Stack>
          <AppSelect label="Category *" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} options={catOptions} />
          <AppSelect label="Brand" value={form.brandId} onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))} options={brandOptions} />
          <Stack direction="row" spacing={2}>
            <AppTextField label="Stock Qty" type="number" value={form.stockQty} onChange={(e) => setForm((p) => ({ ...p, stockQty: parseInt(e.target.value) || 0 }))} />
            <AppTextField label="Reorder Level" type="number" value={form.reorderLevel} onChange={(e) => setForm((p) => ({ ...p, reorderLevel: parseInt(e.target.value) || 0 }))} />
          </Stack>
          <AppTextField label="Primary Image URL" value={form.primaryImageUrl} onChange={(e) => setForm((p) => ({ ...p, primaryImageUrl: e.target.value }))} />
          <AppTextField label="All Image URLs (comma separated)" value={form.imageUrls} onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))} />
          <AppSelect label="Status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
        </Stack>
      </AppModal>

      {/* Delete Confirmation */}
      <AppModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        actions={
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
            <AppButton color="error" loading={deleting} onClick={handleDelete}>Delete</AppButton>
          </Stack>
        }
      >
        <Typography>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </Typography>
      </AppModal>
    </Box>
  );
}
