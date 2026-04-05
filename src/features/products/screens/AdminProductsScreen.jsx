import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PageHeader from '../../../components/common/PageHeader';
import AppModal from '../../../components/common/AppModal';
import AppButton from '../../../components/common/AppButton';
import AppPagination from '../../../components/common/AppPagination';
import ProductFilters from './admin/ProductFilters';
import ProductTable from './admin/ProductTable';
import ProductFormModal from './admin/ProductFormModal';
import { productService } from '../services/productService';

const PAGE_SIZE = 20;


export default function AdminProductsScreen() {
  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [brands, setBrands]               = useState([]);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch]               = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [loading, setLoading]             = useState(true);
  const [selectedIds, setSelectedIds]     = useState(new Set());
  const [formModal, setFormModal]         = useState(null);
  const [saving, setSaving]               = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleting, setDeleting]           = useState(false);
  const [snack, setSnack]                 = useState({ open: false, msg: '', sev: 'success' });

  const showSnack = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  const loadProducts = useCallback(() => {
    setLoading(true);
    setSelectedIds(new Set());

    const fetchFn = search.trim()
      ? productService.searchProducts(search.trim(), { page: page - 1, size: PAGE_SIZE })
      : productService.getAdminProducts({ page: page - 1, size: PAGE_SIZE });

    fetchFn
      .then((paged) => {
        let data = paged.data ?? [];
        if (categoryFilter) data = data.filter((p) => String(p.categoryId) === String(categoryFilter));
        if (statusFilter)   data = data.filter((p) => p.status === statusFilter);
        setProducts(data);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => showSnack('Failed to load products.', 'error'))
      .finally(() => setLoading(false));
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
    productService.getBrands().then(setBrands).catch(() => {});
  }, []);

  const handleSave = async ({ form, imageFiles, existingImages }) => {
    setSaving(true);
    try {
      const productId = formModal?.productId;
      const payload = {
        ...form,
        primaryImageUrl: existingImages[0] ?? null,
        imageUrls:       existingImages.slice(1).filter(Boolean),
      };

      productId
        ? await productService.updateProduct(productId, payload, imageFiles)
        : await productService.createProduct(payload, imageFiles);

      setFormModal(null);
      showSnack(productId ? 'Product updated successfully.' : 'Product created successfully.');
      setPage(1);
      loadProducts();
    } catch (err) {
      showSnack(err.message || 'Failed to save product.', 'error');
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
      showSnack('Product deleted.');
      loadProducts();
    } catch (err) {
      showSnack(err.message || 'Failed to delete product.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setProducts((prev) =>
      prev.map((p) => p.productId === product.productId ? { ...p, status: newStatus } : p)
    );
    try {
      await productService.updateProduct(product.productId, { ...product, status: newStatus });
    } catch {
      setProducts((prev) =>
        prev.map((p) => p.productId === product.productId ? { ...p, status: product.status } : p)
      );
      showSnack('Failed to update status.', 'error');
    }
  };

  const handleStockChange = (productId, newQty) => {
    setProducts((prev) =>
      prev.map((p) => p.productId === productId ? { ...p, stockQty: newQty } : p)
    );
  };

  const handleSelectOne = (productId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === products.length ? new Set() : new Set(products.map((p) => p.productId))
    );
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'],
      ...products.map((p) => [p.productId, p.name, p.sku, p.categoryName, p.price, p.stockQty, p.status]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Product Management"
        subtitle="Manage your product catalog and inventory"
      />

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={(v) => { setCategoryFilter(v); setPage(1); }}
        categories={categories}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
        onExport={handleExport}
        onAddProduct={() => setFormModal({})}
      />

      <ProductTable
        products={products}
        loading={loading}
        selectedIds={selectedIds}
        onSelectOne={handleSelectOne}
        onSelectAll={handleSelectAll}
        onView={(p) => window.open(`/product/${p.productId}`, '_blank')}
        onEdit={(p) => setFormModal(p)}
        onDelete={(p) => setDeleteTarget(p)}
        onToggleStatus={handleToggleStatus}
        onStockChange={handleStockChange}
      />

      {totalPages > 1 && (
        <AppPagination
          page={page}
          count={totalPages}
          total={totalElements}
          rowsPerPage={PAGE_SIZE}
          showRowsPerPage={false}
          onPageChange={(val) => setPage(val)}
          sx={{ mt: 0.5 }}
        />
      )}

      {totalElements > 0 && !loading && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, totalElements)} of {totalElements} products
          </Typography>
        </Box>
      )}

      <ProductFormModal
        open={!!formModal}
        product={formModal && formModal.productId ? formModal : null}
        categories={categories}
        brands={brands}
        onClose={() => setFormModal(null)}
        onSave={handleSave}
        saving={saving}
        onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
        onBrandCreated={(newBrand) => setBrands((prev) => [...prev, newBrand])}
      />

      <AppModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        actions={
          <Stack direction="row" spacing={1.5} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton variant="outlined" onClick={() => setDeleteTarget(null)} sx={{ borderColor: 'divider', color: 'text.secondary' }}>
              Cancel
            </AppButton>
            <AppButton color="error" loading={deleting} onClick={handleDelete} sx={{ fontWeight: 700 }}>
              Delete Product
            </AppButton>
          </Stack>
        }
      >
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          This will permanently remove the product and all associated data. This action cannot be undone.
        </Typography>
      </AppModal>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ minWidth: 260 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
