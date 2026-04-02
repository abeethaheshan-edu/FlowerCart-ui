import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { PagedResponseModel } from '../../products/models/ProductModels';

// Matches backend InventoryDTO
export class InventoryModel {
  constructor(data = {}) {
    this.productId = data.productId ?? null;
    this.productName = data.productName ?? '';
    this.stockQty = data.stockQty ?? 0;
    this.reorderLevel = data.reorderLevel ?? 5;
    this.lowStock = data.lowStock ?? false;
    this.updatedAt = data.updatedAt ?? null;
  }
}

function _mapInventory(pagedData) {
  const paged = new PagedResponseModel(pagedData);
  paged.data = (pagedData.data ?? []).map((i) => new InventoryModel(i));
  return paged;
}

function getLowStock({ page = 0, size = 20 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.inventory.lowStock);
  req.query = { page, size };
  return req
    .then((res) => _mapInventory(res.data))
    .catch((err) => Promise.reject(err));
}

function updateInventory(productId, { stockQty, reorderLevel }) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.inventory.update, productId);
  req.body = { stockQty, reorderLevel };
  return req
    .then((res) => new InventoryModel(res.data))
    .catch((err) => Promise.reject(err));
}

export const inventoryService = { getLowStock, updateInventory };
