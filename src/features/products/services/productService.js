import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { ProductModel, PagedResponseModel, CategoryModel, BrandModel } from '../models/ProductModels';

function _mapProducts(pagedData) {
  const paged = new PagedResponseModel(pagedData);
  paged.data = (pagedData.data ?? []).map((p) => new ProductModel(p));
  return paged;
}

// ── Public product endpoints ──────────────────────────────────────────────────

function getProducts({ page = 0, size = 12, sortBy = 'createdAt', direction = 'desc' } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.products.list);
  req.query = { page, size, sortBy, direction };
  return req
    .then((res) => _mapProducts(res.data))
    .catch((err) => Promise.reject(err));
}

function getProductById(productId) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.products.detail, productId);
  return req
    .then((res) => new ProductModel(res.data))
    .catch((err) => Promise.reject(err));
}

function getProductsByCategory(categoryId, { page = 0, size = 12 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.products.byCategory, categoryId);
  req.query = { page, size };
  return req
    .then((res) => _mapProducts(res.data))
    .catch((err) => Promise.reject(err));
}

function getProductsByBrand(brandId, { page = 0, size = 12 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.products.byBrand, brandId);
  req.query = { page, size };
  return req
    .then((res) => _mapProducts(res.data))
    .catch((err) => Promise.reject(err));
}

function searchProducts(keyword, { page = 0, size = 12 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.products.search);
  req.query = { keyword, page, size };
  return req
    .then((res) => _mapProducts(res.data))
    .catch((err) => Promise.reject(err));
}

// ── Admin product endpoints ───────────────────────────────────────────────────

function getAdminProducts({ page = 0, size = 20, sortBy = 'createdAt', direction = 'desc' } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.admin.products);
  req.query = { page, size, sortBy, direction };
  return req
    .then((res) => _mapProducts(res.data))
    .catch((err) => Promise.reject(err));
}

function createProduct(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.products.create);
  req.body = body;
  return req
    .then((res) => new ProductModel(res.data))
    .catch((err) => Promise.reject(err));
}

function updateProduct(productId, body) {
  const req = apiClient.put();
  req.url = resolvePath(API_PATH.products.update, productId);
  req.body = body;
  return req
    .then((res) => new ProductModel(res.data))
    .catch((err) => Promise.reject(err));
}

function deleteProduct(productId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.products.delete, productId);
  return req
    .then(() => true)
    .catch((err) => Promise.reject(err));
}

// ── Categories ────────────────────────────────────────────────────────────────

function getCategories() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.categories.list);
  return req
    .then((res) => (res.data ?? []).map((c) => new CategoryModel(c)))
    .catch((err) => Promise.reject(err));
}

function createCategory(name) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.categories.create);
  req.body = { name };
  return req
    .then((res) => new CategoryModel(res.data))
    .catch((err) => Promise.reject(err));
}

function updateCategory(categoryId, name) {
  const req = apiClient.put();
  req.url = resolvePath(API_PATH.categories.update, categoryId);
  req.body = { name };
  return req
    .then((res) => new CategoryModel(res.data))
    .catch((err) => Promise.reject(err));
}

function deleteCategory(categoryId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.categories.delete, categoryId);
  return req
    .then(() => true)
    .catch((err) => Promise.reject(err));
}

// ── Brands ────────────────────────────────────────────────────────────────────

function getBrands() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.brands.list);
  return req
    .then((res) => (res.data ?? []).map((b) => new BrandModel(b)))
    .catch((err) => Promise.reject(err));
}

function createBrand(name) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.brands.create);
  req.body = { name };
  return req
    .then((res) => new BrandModel(res.data))
    .catch((err) => Promise.reject(err));
}

function updateBrand(brandId, name) {
  const req = apiClient.put();
  req.url = resolvePath(API_PATH.brands.update, brandId);
  req.body = { name };
  return req
    .then((res) => new BrandModel(res.data))
    .catch((err) => Promise.reject(err));
}

function deleteBrand(brandId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.brands.delete, brandId);
  return req
    .then(() => true)
    .catch((err) => Promise.reject(err));
}

export const productService = {
  getProducts, getProductById, getProductsByCategory, getProductsByBrand,
  searchProducts, getAdminProducts, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory, updateCategory, deleteCategory,
  getBrands, createBrand, updateBrand, deleteBrand,
};
