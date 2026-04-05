import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AppModal from '../../../../components/common/AppModal';
import AppButton from '../../../../components/common/AppButton';
import AppTextField from '../../../../components/common/AppTextField';
import AppSelect from '../../../../components/common/AppSelect';
import CreatableSelect from './CreatableSelect';
import ProductImageUpload from './ProductImageUpload';
import { productService } from '../../services/productService';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const FLOWER_COLOR_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'pink', label: 'Pink' },
  { value: 'white', label: 'White' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'other', label: 'Other' },
];

const OCCASION_OPTIONS = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'sympathy', label: 'Sympathy' },
  { value: 'congratulations', label: 'Congratulations' },
  { value: 'valentines', label: "Valentine's Day" },
  { value: 'mothers_day', label: "Mother's Day" },
  { value: 'get_well', label: 'Get Well Soon' },
  { value: 'all_occasions', label: 'All Occasions' },
];

const FRAGRANCE_OPTIONS = [
  { value: 'none', label: 'No Fragrance' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  sku: '',
  price: '',
  categoryId: '',
  brandId: '',
  stockQty: 0,
  reorderLevel: 5,
  status: 'ACTIVE',
  flowerColor: '',
  occasion: '',
  fragrance: '',
  careInstructions: '',
  stemLength: '',
};

function buildFormFromProduct(p) {
  return {
    name: p.name ?? '',
    description: p.description ?? '',
    sku: p.sku ?? '',
    price: p.price ?? '',
    categoryId: p.categoryId != null ? String(p.categoryId) : '',
    brandId: p.brandId != null ? String(p.brandId) : '',
    stockQty: p.stockQty ?? 0,
    reorderLevel: p.reorderLevel ?? 5,
    status: p.status ?? 'ACTIVE',
    flowerColor: p.flowerColor ?? '',
    occasion: p.occasion ?? '',
    fragrance: p.fragrance ?? '',
    careInstructions: p.careInstructions ?? '',
    stemLength: p.stemLength ?? '',
  };
}

function buildInitialImages(p) {
  if (!p) return Array(5).fill(null);
  const slots = Array(5).fill(null);
  if (p.primaryImageUrl) slots[0] = p.primaryImageUrl;
  (p.imageUrls ?? []).forEach((url, i) => {
    if (i < 4) slots[i + 1] = url;
  });
  return slots;
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{
        display: 'block',
        mb: 1.5,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        fontSize: '0.7rem',
      }}
    >
      {children}
    </Typography>
  );
}

export default function ProductFormModal({
  open,
  product,
  categories,
  brands,
  onClose,
  onSave,
  saving,
  onCategoryCreated,
  onBrandCreated,
}) {
  const isEdit = !!product;

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState(Array(5).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));
  const [errors, setErrors] = useState({});
  const [creatingCat, setCreatingCat] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(product ? buildFormFromProduct(product) : EMPTY_FORM);
      setImages(buildInitialImages(product));
      setImageFiles(Array(5).fill(null));
      setErrors({});
    }
  }, [open, product]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setVal = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleImageSelect = (index, file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const n = [...prev];
      n[index] = url;
      return n;
    });
    setImageFiles((prev) => {
      const n = [...prev];
      n[index] = file;
      return n;
    });
  };

  const handleImageRemove = (index) => {
    setImages((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
    setImageFiles((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
  };

  const handleCreateCategory = async (name) => {
    setCreatingCat(true);
    try {
      const created = await productService.createCategory(name);
      onCategoryCreated?.(created);
      setVal('categoryId', String(created.categoryId));
      setErrors((prev) => ({ ...prev, categoryId: undefined }));
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleCreateBrand = async (name) => {
    setCreatingBrand(true);
    try {
      const created = await productService.createBrand(name);
      onBrandCreated?.(created);
      setVal('brandId', String(created.brandId));
    } catch (err) {
      console.error('Failed to create brand:', err);
    } finally {
      setCreatingBrand(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Flower name is required';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
      errs.price = 'Valid price required';
    if (!form.categoryId) errs.categoryId = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      form: {
        ...form,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
        brandId: form.brandId ? parseInt(form.brandId) : null,
        stockQty: parseInt(form.stockQty) || 0,
        reorderLevel: parseInt(form.reorderLevel) || 5,
      },
      imageFiles,
      existingImages: images,
    });
  };

  const catOptions = categories.map((c) => ({ value: String(c.categoryId), label: c.name }));
  const brandOptions = brands.map((b) => ({ value: String(b.brandId), label: b.name }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit — ${product?.name}` : 'Add New Product'}
      maxWidth="sm"
      actions={
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <AppButton
            variant="outlined"
            onClick={onClose}
            sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
          >
            Cancel
          </AppButton>
          <AppButton
            loading={saving}
            onClick={handleSubmit}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {isEdit ? 'Save Changes' : 'Create Product'}
          </AppButton>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <ProductImageUpload
          images={images}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
        />

        <Divider />

        <Box>
          <SectionLabel>Basic Information</SectionLabel>
          <Stack spacing={2}>
            <AppTextField
              label="Flower Name *"
              value={form.name}
              onChange={set('name')}
              error={!!errors.name}
              helperText={errors.name}
              size="small"
            />
            <AppTextField
              label="Description"
              value={form.description}
              onChange={set('description')}
              multiline
              rows={2}
              size="small"
            />
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <AppTextField label="SKU" value={form.sku} onChange={set('sku')} size="small" />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label="Price ($) *"
                  type="number"
                  value={form.price}
                  onChange={set('price')}
                  error={!!errors.price}
                  helperText={errors.price}
                  size="small"
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <SectionLabel>Flower Details</SectionLabel>
          <Stack spacing={2}>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <AppSelect
                  label="Flower Color"
                  value={form.flowerColor}
                  onChange={set('flowerColor')}
                  options={FLOWER_COLOR_OPTIONS}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label="Stem Length (cm)"
                  type="number"
                  value={form.stemLength}
                  onChange={set('stemLength')}
                  size="small"
                />
              </Grid>
            </Grid>
            <AppSelect
              label="Occasion"
              value={form.occasion}
              onChange={set('occasion')}
              options={OCCASION_OPTIONS}
              size="small"
            />
            <AppSelect
              label="Fragrance Level"
              value={form.fragrance}
              onChange={set('fragrance')}
              options={FRAGRANCE_OPTIONS}
              size="small"
            />
            <AppTextField
              label="Care Instructions"
              value={form.careInstructions}
              onChange={set('careInstructions')}
              placeholder="e.g. Keep in cool water, trim stems every 2 days"
              multiline
              rows={2}
              size="small"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <SectionLabel>Category & Supplier</SectionLabel>
          <Stack spacing={2}>
            <CreatableSelect
              label="Category *"
              options={catOptions}
              value={form.categoryId}
              onChange={(val) => setVal('categoryId', val)}
              onCreate={handleCreateCategory}
              error={!!errors.categoryId}
              helperText={errors.categoryId}
              creating={creatingCat}
              placeholder="Search or type to add new category…"
              size="small"
            />
            <CreatableSelect
              label="Supplier / Brand"
              options={brandOptions}
              value={form.brandId}
              onChange={(val) => setVal('brandId', val)}
              onCreate={handleCreateBrand}
              creating={creatingBrand}
              placeholder="Search or type to add new supplier…"
              size="small"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <SectionLabel>Inventory & Status</SectionLabel>
          <Stack spacing={2}>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <AppTextField
                  label="Stock Quantity"
                  type="number"
                  value={form.stockQty}
                  onChange={set('stockQty')}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <AppTextField
                  label="Reorder Level"
                  type="number"
                  value={form.reorderLevel}
                  onChange={set('reorderLevel')}
                  size="small"
                />
              </Grid>
            </Grid>
            <AppSelect
              label="Status"
              value={form.status}
              onChange={set('status')}
              options={STATUS_OPTIONS}
              size="small"
            />
          </Stack>
        </Box>
      </Stack>
    </AppModal>
  );
}
