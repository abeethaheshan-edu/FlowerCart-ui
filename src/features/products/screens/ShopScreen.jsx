import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppButton from '../../../components/common/AppButton';
import AppTextField from '../../../components/common/AppTextField';
import AppPagination from '../../../components/common/AppPagination';
import { productService } from '../services/productService';
import { cartService } from '../../checkout/services/cartService';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { authService } from '../../auth/services/authService';
import bannerImg from '../../../assets/flower-bouquet.png';


const OCCASION_FILTERS = ['Birthday', 'Anniversary', 'Wedding', 'Sympathy', 'Congratulations'];
const COLOR_OPTIONS = [
  { label: 'Red',    value: 'red',    hex: '#E53935' },
  { label: 'Pink',   value: 'pink',   hex: '#F06292' },
  { label: 'White',  value: 'white',  hex: '#F5F5F5' },
  { label: 'Yellow', value: 'yellow', hex: '#FDD835' },
  { label: 'Purple', value: 'purple', hex: '#9C27B0' },
];
const SPECIAL_FILTERS = ['Same-Day Delivery', 'Best Seller', 'Fresh Today', 'Luxury Collection', 'Flower bouquets'];

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Featured' },
  { value: 'price_asc',      label: 'Price: Low to High' },
  { value: 'price_desc',     label: 'Price: High to Low' },
  { value: 'name_asc',       label: 'Name: A–Z' },
  { value: 'createdAt_asc',  label: 'Oldest First' },
];

const PAGE_SIZE = 12;


function Stars({ rating = 5, count }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
      {[1,2,3,4,5].map((s) => (
        <StarIcon key={s} sx={{ fontSize: 14, color: s <= Math.round(rating) ? '#F5A623' : '#ddd' }} />
      ))}
      {count != null && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          ({count})
        </Typography>
      )}
    </Box>
  );
}


function ShopProductCard({ product, onAddToCart, cartLoading, onNavigate }) {
  return (
    <Box
      onClick={() => onNavigate(product.productId)}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: '0 8px 28px rgba(232,93,142,0.14)', transform: 'translateY(-3px)' },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', bgcolor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, minHeight: { xs: 160, sm: 200 } }}>
        {product.isLowStock && (
          <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, bgcolor: '#ff9800', color: '#fff', px: 1.2, py: 0.3, borderRadius: 1.5, fontSize: '0.68rem', fontWeight: 700 }}>
            Low Stock
          </Box>
        )}
        <Box
          component="img"
          src={product.primaryImageUrl || bannerImg}
          alt={product.name}
          sx={{ width: '100%', maxHeight: { xs: 150, sm: 190 }, objectFit: 'contain', display: 'block' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        {product.categoryName && (
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 500, mb: 0.4 }}>
            {product.categoryName}
          </Typography>
        )}
        <Typography fontWeight={700} noWrap sx={{ mb: 0.5, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
          {product.name}
        </Typography>
        {product.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8, lineHeight: 1.4,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.description}
          </Typography>
        )}
        {product.averageRating != null && (
          <Box sx={{ mb: 1 }}>
            <Stars rating={product.averageRating} count={product.reviewCount} />
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, gap: 1, flexWrap: 'wrap' }}>
          <Typography fontWeight={800} sx={{ color: '#E85D8E', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            {product.formattedPrice}
          </Typography>
          <AppButton
            size="small"
            loading={cartLoading}
            disabled={!product.isInStock}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            sx={{
              bgcolor: product.isInStock ? '#E85D8E' : undefined,
              color: product.isInStock ? '#fff' : undefined,
              fontWeight: 600, fontSize: '0.78rem', borderRadius: 50, px: 1.8,
              '&:hover': { bgcolor: product.isInStock ? '#C94375' : undefined },
            }}
          >
            {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}


function ProductSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="50%" height={12} sx={{ mb: 0.8 }} />
        <Skeleton width="80%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton width="60%" height={14} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="30%" height={26} />
          <Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: 50 }} />
        </Box>
      </Box>
    </Box>
  );
}


function FilterSidebar({ categories, selectedCategory, onCategoryChange, selectedColors, onColorToggle,
  priceMin, priceMax, onPriceChange, selectedOccasions, onOccasionToggle,
  selectedSpecials, onSpecialToggle, onClearAll }) {

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>Filter</Typography>
        <Typography
          variant="body2"
          onClick={onClearAll}
          sx={{ color: '#E85D8E', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
        >
          Clear all
        </Typography>
      </Box>

      {/* Flower Type / Category */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <LocalFloristIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight={700}>Flower Type</Typography>
        </Box>
        {categories.map((cat) => (
          <Box
            key={cat.categoryId ?? 'all'}
            onClick={() => onCategoryChange(cat.categoryId ?? '')}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              py: 0.6, px: 0.5, cursor: 'pointer', borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 16, height: 16, borderRadius: 0.5,
                border: '1.5px solid',
                borderColor: selectedCategory === (cat.categoryId ?? '') ? '#E85D8E' : 'divider',
                bgcolor: selectedCategory === (cat.categoryId ?? '') ? '#E85D8E' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {selectedCategory === (cat.categoryId ?? '') && (
                  <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: '#fff' }} />
                )}
              </Box>
              <Typography variant="body2">{cat.name}</Typography>
            </Box>
            {cat.count != null && (
              <Typography variant="caption" color="text.secondary">({cat.count})</Typography>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Occasion */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <CardGiftcardOutlinedIcon sx={{ fontSize: 16, color: '#E85D8E' }} />
          <Typography variant="body2" fontWeight={700}>Occasion</Typography>
        </Box>
        {OCCASION_FILTERS.map((occ) => (
          <FormControlLabel
            key={occ}
            control={
              <Checkbox
                size="small"
                checked={selectedOccasions.includes(occ)}
                onChange={() => onOccasionToggle(occ)}
                sx={{ p: 0.5, color: 'divider', '&.Mui-checked': { color: '#E85D8E' } }}
              />
            }
            label={<Typography variant="body2">{occ}</Typography>}
            sx={{ display: 'flex', mx: 0, mb: 0.4 }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Color */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <PaletteOutlinedIcon sx={{ fontSize: 16, color: '#E85D8E' }} />
          <Typography variant="body2" fontWeight={700}>Color</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {COLOR_OPTIONS.map((c) => (
            <Box
              key={c.value}
              onClick={() => onColorToggle(c.value)}
              title={c.label}
              sx={{
                width: 32, height: 32, borderRadius: '50%',
                bgcolor: c.hex, cursor: 'pointer',
                border: selectedColors.includes(c.value) ? '2.5px solid #E85D8E' : '2px solid transparent',
                outline: selectedColors.includes(c.value) ? '2px solid rgba(232,93,142,0.3)' : '2px solid #ddd',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.15)' },
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <AttachMoneyIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" fontWeight={700}>Price Range</Typography>
        </Box>
        <AppTextField
          placeholder="$20"
          type="number"
          value={priceMin}
          onChange={(e) => onPriceChange('min', e.target.value)}
          sx={{ mb: 1.5 }}
        />
        <AppTextField
          placeholder="$200"
          type="number"
          value={priceMax}
          onChange={(e) => onPriceChange('max', e.target.value)}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Special */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
          <LocalFloristIcon sx={{ fontSize: 16, color: '#E85D8E' }} />
          <Typography variant="body2" fontWeight={700}>Special</Typography>
        </Box>
        {SPECIAL_FILTERS.map((s) => (
          <FormControlLabel
            key={s}
            control={
              <Checkbox
                size="small"
                checked={selectedSpecials.includes(s)}
                onChange={() => onSpecialToggle(s)}
                sx={{ p: 0.5, color: 'divider', '&.Mui-checked': { color: '#E85D8E' } }}
              />
            }
            label={<Typography variant="body2">{s}</Typography>}
            sx={{ display: 'flex', mx: 0, mb: 0.4 }}
          />
        ))}
      </Box>
    </Box>
  );
}


export default function ShopScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── products state ── */
  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [totalPages, setTotalPages]       = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [cartLoading, setCartLoading]     = useState(null);
  const [snack, setSnack]                 = useState({ open: false, msg: '', sev: 'success' });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const page       = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = searchParams.get('category') || '';
  const sort       = searchParams.get('sort') || 'createdAt_desc';
  const keyword    = searchParams.get('q') || '';

  const [selectedColors,    setSelectedColors]    = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSpecials,  setSelectedSpecials]  = useState([]);
  const [priceMin,          setPriceMin]          = useState('');
  const [priceMax,          setPriceMax]          = useState('');

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };


  useEffect(() => {
    productService.getCategories()
      .then((cats) => setCategories([{ categoryId: '', name: 'All' }, ...cats]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    const [sortBy, direction] = sort.split('_');
    const apiPage = page - 1;

    const fetchFn = keyword
      ? productService.searchProducts(keyword, { page: apiPage, size: PAGE_SIZE })
      : categoryId
        ? productService.getProductsByCategory(categoryId, { page: apiPage, size: PAGE_SIZE })
        : productService.getProducts({ page: apiPage, size: PAGE_SIZE, sortBy, direction });

    fetchFn
      .then((paged) => {
        let data = paged.data ?? [];
        if (priceMin) data = data.filter((p) => p.price >= parseFloat(priceMin));
        if (priceMax) data = data.filter((p) => p.price <= parseFloat(priceMax));
        setProducts(data);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, categoryId, sort, keyword, priceMin, priceMax]);

  const handleAddToCart = useCallback(async (product) => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setCartLoading(product.productId);
    try {
      await cartService.addItem(product.productId, 1);
      setSnack({ open: true, msg: `${product.name} added to cart!`, sev: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: err.message || 'Could not add to cart', sev: 'error' });
    } finally {
      setCartLoading(null);
    }
  }, [navigate]);

  const toggleColor    = (v) => setSelectedColors((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleOccasion = (v) => setSelectedOccasions((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleSpecial  = (v) => setSelectedSpecials((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const clearAll = () => {
    setParam('category', '');
    setParam('q', '');
    setParam('sort', '');
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSelectedSpecials([]);
    setPriceMin('');
    setPriceMax('');
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Featured';

  const filterProps = {
    categories, selectedCategory: categoryId,
    onCategoryChange: (v) => setParam('category', v),
    selectedColors, onColorToggle: toggleColor,
    priceMin, priceMax, onPriceChange: (k, v) => k === 'min' ? setPriceMin(v) : setPriceMax(v),
    selectedOccasions, onOccasionToggle: toggleOccasion,
    selectedSpecials, onSpecialToggle: toggleSpecial,
    onClearAll: clearAll,
  };


  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh' }}>
      <Grid container sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 0, md: 2 }, py: { xs: 2, md: 3 } }}>
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' }, pr: 2 }}>
          <Box sx={{
            bgcolor: 'background.paper', borderRadius: 2, border: '1px solid',
            borderColor: 'divider', p: 2.5, position: 'sticky', top: 80,width:'300px'
          }}>
            <FilterSidebar {...filterProps} />
          </Box>
        </Grid>

        <Grid item xs={12} md={9} sx={{ px: { xs: 2, md: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "'Playfair Display', Georgia, serif", mb: 0.4, fontSize: { xs: '1.6rem', md: '2rem' } }}>
                {categoryId
                  ? (categories.find((c) => String(c.categoryId) === String(categoryId))?.name ?? 'Products')
                  : keyword ? `Search: "${keyword}"` : 'All Flowers'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loading ? 'Loading…' : `Showing ${totalElements} beautiful bouquet${totalElements !== 1 ? 's' : ''}`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <AppButton
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setMobileFilterOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, borderColor: 'divider', color: 'text.primary', borderRadius: 2 }}
              >
                Filter
              </AppButton>
              {/* Sort dropdown */}
              <Box
                sx={{
                  border: '1px solid', borderColor: 'divider', borderRadius: 2,
                  px: 2, py: 1, cursor: 'pointer', bgcolor: 'background.paper',
                  display: 'flex', alignItems: 'center', gap: 1, minWidth: 180,
                  position: 'relative',
                }}
              >
                <Typography variant="body2">Sort by: <strong>{currentSortLabel}</strong></Typography>
                <Box component="select"
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Box>
              </Box>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Product Grid */}
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <Grid item xs={6} sm={4} md={4} lg={4} key={i}>
                    <ProductSkeleton />
                  </Grid>
                ))
              : products.length === 0
                ? (
                  <Grid item xs={12}>
                    <Box sx={{
                      textAlign: 'center', py: { xs: 6, md: 10 },
                      border: '2px dashed', borderColor: 'divider', borderRadius: 2,
                    }}>
                      <LocalFloristIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No flowers found</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Try adjusting your filters or search a different term.
                      </Typography>
                      <AppButton
                        variant="outlined"
                        onClick={clearAll}
                        sx={{ borderColor: '#E85D8E', color: '#E85D8E', borderRadius: 50, px: 3 }}
                      >
                        Clear all filters
                      </AppButton>
                    </Box>
                  </Grid>
                )
                : products.map((product) => (
                  <Grid item xs={6} sm={4} md={4} lg={4} key={product.productId}>
                    <ShopProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      cartLoading={cartLoading === product.productId}
                      onNavigate={(id) => navigate(`/product/${id}`)}
                    />
                  </Grid>
                ))
            }
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <AppPagination
                page={page}
                count={totalPages}
                total={totalElements}
                rowsPerPage={PAGE_SIZE}
                showRowsPerPage={false}
                onPageChange={(val) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(val));
                  setSearchParams(next);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* ── MOBILE FILTER DRAWER ── */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{ sx: { width: 300, p: 2.5, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterSidebar {...filterProps} />
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))} sx={{ minWidth: 240 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
