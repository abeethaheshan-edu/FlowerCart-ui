// Matches backend ProductDTO
export class ProductModel {
  constructor(data = {}) {
    this.productId = data.productId ?? null;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.sku = data.sku ?? '';
    this.price = parseFloat(data.price ?? 0);
    this.status = data.status ?? 'ACTIVE';
    this.categoryId = data.categoryId ?? null;
    this.categoryName = data.categoryName ?? '';
    this.brandId = data.brandId ?? null;
    this.brandName = data.brandName ?? '';
    this.stockQty = data.stockQty ?? 0;
    this.reorderLevel = data.reorderLevel ?? 5;
    this.imageUrls = data.imageUrls ?? [];
    this.primaryImageUrl = data.primaryImageUrl ?? null;
    this.averageRating = data.averageRating ?? null;
    this.reviewCount = data.reviewCount ?? 0;
    this.createdAt = data.createdAt ?? null;
  }

  get formattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  get isInStock() {
    return this.stockQty > 0;
  }

  get isLowStock() {
    return this.stockQty > 0 && this.stockQty <= this.reorderLevel;
  }
}

// Matches backend PagedResponse<T>
export class PagedResponseModel {
  constructor(data = {}) {
    this.data = data.data ?? [];
    this.page = data.page ?? 0;
    this.size = data.size ?? 12;
    this.totalElements = data.totalElements ?? 0;
    this.totalPages = data.totalPages ?? 0;
    this.first = data.first ?? true;
    this.last = data.last ?? true;
    this.hasNext = data.hasNext ?? false;
    this.hasPrevious = data.hasPrevious ?? false;
  }
}

export class ProductCreateModel {
  constructor(data = {}) {
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.sku = data.sku ?? '';
    this.price = data.price ?? 0;
    this.categoryId = data.categoryId ?? null;
    this.brandId = data.brandId ?? null;
    this.stockQty = data.stockQty ?? 0;
    this.reorderLevel = data.reorderLevel ?? 5;
    this.imageUrls = data.imageUrls ?? [];
    this.primaryImageUrl = data.primaryImageUrl ?? null;
    this.status = data.status ?? 'ACTIVE';
  }
}

// Matches backend CategoryDTO
export class CategoryModel {
  constructor(data = {}) {
    this.categoryId = data.categoryId ?? null;
    this.name = data.name ?? '';
  }
}

// Matches backend BrandDTO
export class BrandModel {
  constructor(data = {}) {
    this.brandId = data.brandId ?? null;
    this.name = data.name ?? '';
  }
}
