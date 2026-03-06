// this is only example,  error handling   (catch)  more accurate  

import apiClient, { ContentType } from '../core/network/ApiClient';
import { resolvePath } from '../core/network/utils/PathResolver';
import { API_PATH } from '../core/network/utils/ApiEndpoints';

function getMyOrders() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.my);

  return req.then((res) => res.data.map((o) => new Order(o))).catch((err) => Promise.reject(err));
}

function getOrders(status, { page, limit } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.adminList, status);
  req.query = { page, limit };

  return req.then((res) => res.data.map((o) => new Order(o))).catch((err) => Promise.reject(err));
}

function getOrderById(orderId) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.orders.adminList, orderId);

  return req.then((res) => new Order(res.data)).catch((err) => Promise.reject(err));
}

function createOrder(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.orders.create);
  req.body = body;

  return req.then((res) => new Order(res.data)).catch((err) => Promise.reject(err));
}

function updateOrder(orderId, body) {
  const req = apiClient.put();
  req.url = resolvePath(API_PATH.orders.adminList, orderId);
  req.body = body;

  return req.then((res) => new Order(res.data)).catch((err) => Promise.reject(err));
}

function updateOrderItem(orderId, itemId, body) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.orders.adminOrderItem, [orderId, itemId]);
  req.body = body;

  return req.then((res) => new OrderItem(res.data)).catch((err) => Promise.reject(err));
}

function deleteOrder(orderId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.orders.adminList, orderId);

  return req.then((res) => res.data).catch((err) => Promise.reject(err));
}

function deleteOrderItem(orderId, itemId) {
  const req = apiClient.delete();
  req.url = resolvePath(API_PATH.orders.adminOrderItem, [orderId, itemId]);

  return req.then((res) => res.data).catch((err) => Promise.reject(err));
}

function uploadOrderAttachment(orderId, file, label) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.orders.attachments, orderId);
  req.contentType = ContentType.MULTIPART;
  req.headers = { 'X-Upload-Source': 'web' };

  req.addField('label', label);
  req.addFile('attachment', file);

  return req.then((res) => res.data).catch((err) => Promise.reject(err));
}

function uploadItemPhotos(orderId, itemId, photoFiles = []) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.orders.itemPhotos, [orderId, itemId]);
  req.contentType = ContentType.MULTIPART;
  req.headers = { 'X-Upload-Source': 'web' };

  req.addField('count', photoFiles.length);

  photoFiles.forEach((file, i) => {
    req.addFile(`photo_${i}`, file, file.name ?? `photo_${i}`);
  });

  return req.then((res) => res.data).catch((err) => Promise.reject(err));
}

export {
  getMyOrders,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderItem,
  deleteOrder,
  deleteOrderItem,
  uploadOrderAttachment,
  uploadItemPhotos,
};
