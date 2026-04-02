import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { CartModel } from '../../order/models/OrderModels';

function getCart() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.cart.get);
  return req
    .then((res) => new CartModel(res.data))
    .catch((err) => Promise.reject(err));
}

function addItem(productId, quantity = 1) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.cart.addItem);
  req.body = { productId, quantity };
  return req
    .then((res) => new CartModel(res.data))
    .catch((err) => Promise.reject(err));
}

function updateItemQuantity(cartItemId, quantity) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.cart.updateItem, cartItemId);
  req.query = { quantity };
  return req
    .then((res) => new CartModel(res.data))
    .catch((err) => Promise.reject(err));
}

function removeItem(cartItemId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.cart.removeItem, cartItemId);
  return req
    .then((res) => new CartModel(res.data))
    .catch((err) => Promise.reject(err));
}

function clearCart() {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.cart.clear);
  return req
    .then(() => null)
    .catch((err) => Promise.reject(err));
}

export const cartService = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
