import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { OrderModel } from '../models/OrderModels';
import { PagedResponseModel as GenericPaged } from '../../products/models/ProductModels';

function _mapOrders(pagedData) {
  const paged = new GenericPaged(pagedData);
  paged.data = (pagedData.data ?? []).map((o) => new OrderModel(o));
  return paged;
}

// ── Customer ──────────────────────────────────────────────────────────────────

function placeOrder(shippingAddressId) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.orders.place);
  req.body = { shippingAddressId };
  return req
    .then((res) => new OrderModel(res.data))
    .catch((err) => Promise.reject(err));
}

function getMyOrders({ page = 0, size = 10 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.my);
  req.query = { page, size };
  return req
    .then((res) => _mapOrders(res.data))
    .catch((err) => Promise.reject(err));
}

function getOrderById(orderId) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.detail, orderId);
  return req
    .then((res) => new OrderModel(res.data))
    .catch((err) => Promise.reject(err));
}

function trackOrder(orderId) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.track, orderId);
  return req
    .then((res) => new OrderModel(res.data))
    .catch((err) => Promise.reject(err));
}

// ── Admin ─────────────────────────────────────────────────────────────────────

function getAdminOrders({ status, page = 0, size = 20 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.adminAll);
  req.query = { page, size, ...(status && { status }) };
  return req
    .then((res) => _mapOrders(res.data))
    .catch((err) => Promise.reject(err));
}

function updateOrderStatus(orderId, status) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.orders.adminUpdateStatus, orderId);
  req.query = { status };
  return req
    .then((res) => new OrderModel(res.data))
    .catch((err) => Promise.reject(err));
}

export const orderService = {
  placeOrder, getMyOrders, getOrderById, trackOrder,
  getAdminOrders, updateOrderStatus,
};
