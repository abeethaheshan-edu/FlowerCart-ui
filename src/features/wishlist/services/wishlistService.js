import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { ProductModel } from '../../products/models/ProductModels';

function getWishlist() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.wishlist.get);
  return req
    .then((res) => (res.data ?? []).map((p) => new ProductModel(p)))
    .catch((err) => Promise.reject(err));
}

function addToWishlist(productId) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.wishlist.add, productId);
  return req
    .then(() => true)
    .catch((err) => Promise.reject(err));
}

function removeFromWishlist(productId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.wishlist.remove, productId);
  return req
    .then(() => true)
    .catch((err) => Promise.reject(err));
}

export const wishlistService = { getWishlist, addToWishlist, removeFromWishlist };
