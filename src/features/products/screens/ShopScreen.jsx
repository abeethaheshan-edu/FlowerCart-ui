import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../../components/common/AppCard';
import AppButton from '../../../components/common/AppButton';
import AppTextField from '../../../components/common/AppTextField';
import AppSelect from '../../../components/common/AppSelect';
import AppPagination from '../../../components/common/AppPagination';
import PageHeader from '../../../components/common/PageHeader';
import bannerImg from '../../../assets/flower-bouquet.png';
import { productService } from '../services/productService';
import { cartService } from '../../checkout/services/cartService';
import { wishlistService } from '../../wishlist/services/wishlistService';
import { authService } from '../../auth/services/authService';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

const PAGE_SIZE = 12;

function ProductSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
      <Skeleton width="70%" /><Skeleton width="40%" />
    </Box>
  );
}

export default function ShopScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [addingToCart, setAddingToCart] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt_desc';
  const keyword = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(keyword);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  // Load categories once
  useEffect(() => {
    productService.getCategories().then((cats) => {
      setCategories([{ categoryId: '', name: 'All Categories' }, ...cats]);
    }).catch(() => {});
  }, []);

  // Load products when filters change
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
        setProducts(paged.data);
        setTotalPages(paged.totalPages || 1);
        setTotalElements(paged.totalElements || 0);
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, categoryId, sort, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('q', searchInput.trim());
  };

  const handleAddToCart = async (product) => {
    if (!authService.isAuthenticated()) { navigate('/auth/login'); return; }
    setAddingToCart(product.productId);
    try { await cartService.addItem(product.productId, 1); } catch { }
    finally { setAddingToCart(null); }
  };

  return (
    <Box sx={{ mx: { xs: 2, md: 4 }, my: 4 }}>
      <PageHeader
        title="Shop Flowers"
        subtitle={`${totalElements} products available`}
      />

      {/* Filters bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="flex-start">
        <Box component="form" onSubmit={handleSearch} sx={{ flex: 1 }}>
          <AppTextField
            label="Search flowers"
            placeholder="Search by name…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <AppButton type="submit" size="small" variant="text">
                  <SearchIcon fontSize="small" />
                </AppButton>
              </InputAdornment>
            }
          />
        </Box>
        <AppSelect
          label="Category"
          value={categoryId}
          onChange={(e) => updateParam('category', e.target.value)}
          options={categories.map((c) => ({ value: c.categoryId, label: c.name }))}
          sx={{ minWidth: 180 }}
        />
        <AppSelect
          label="Sort by"
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          options={SORT_OPTIONS}
          sx={{ minWidth: 200 }}
        />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                <ProductSkeleton />
              </Grid>
            ))
          : products.length === 0
            ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">No products found</Typography>
                  <AppButton variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearchInput(''); setSearchParams({}); }}>
                    Clear filters
                  </AppButton>
                </Box>
              </Grid>
            )
            : products.map((product) => (
                <Grid key={product.productId} item xs={12} sm={6} md={4} lg={3}>
                  <ProductCard
                    image={product.primaryImageUrl || bannerImg}
                    name={product.name}
                    price={product.formattedPrice}
                    badge={product.isLowStock ? 'Low Stock' : null}
                    onClick={() => navigate(`/product/${product.productId}`)}
                    actions={
                      <AppButton
                        size="small"
                        variant="contained"
                        fullWidth
                        loading={addingToCart === product.productId}
                        disabled={!product.isInStock}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      >
                        {product.isInStock ? 'Add to cart' : 'Out of stock'}
                      </AppButton>
                    }
                  />
                </Grid>
              ))
        }
      </Grid>

      {totalPages > 1 && (
        <AppPagination
          page={page}
          count={totalPages}
          total={totalElements}
          rowsPerPage={PAGE_SIZE}
          onPageChange={(val) => {
            const next = new URLSearchParams(searchParams);
            next.set('page', val);
            setSearchParams(next);
          }}
        />
      )}
    </Box>
  );
}
