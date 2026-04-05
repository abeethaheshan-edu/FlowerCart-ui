import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { OrderModel } from '../../order/models/OrderModels';

function placeOrder(shippingPayload) {
  const req = apiClient.post();
  req.url   = resolvePath(API_PATH.orders.place);
  req.body  = shippingPayload;
  return req
    .then((res) => new OrderModel(res.data))
    .catch((err) => Promise.reject(err));
}

function createPaymentIntent(orderId) {
  const req = apiClient.post();
  req.url   = resolvePath(API_PATH.payments.createIntent);
  req.body  = { orderId };
  return req
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

export const paymentService = { placeOrder, createPaymentIntent };
