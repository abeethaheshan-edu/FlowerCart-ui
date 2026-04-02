// Matches backend CartDTO.CartItemDTO
export class CartItemModel {
  constructor(data = {}) {
    this.cartItemId = data.cartItemId ?? null;
    this.productId = data.productId ?? null;
    this.productName = data.productName ?? '';
    this.primaryImageUrl = data.primaryImageUrl ?? null;
    this.quantity = data.quantity ?? 0;
    this.unitPrice = parseFloat(data.unitPrice ?? 0);
    this.lineTotal = parseFloat(data.lineTotal ?? 0);
  }

  get formattedUnitPrice() {
    return `$${this.unitPrice.toFixed(2)}`;
  }

  get formattedLineTotal() {
    return `$${this.lineTotal.toFixed(2)}`;
  }
}

// Matches backend CartDTO
export class CartModel {
  constructor(data = {}) {
    this.cartId = data.cartId ?? null;
    this.items = (data.items ?? []).map((i) => new CartItemModel(i));
    this.subtotal = parseFloat(data.subtotal ?? 0);
    this.itemCount = data.itemCount ?? 0;
  }

  get formattedSubtotal() {
    return `$${this.subtotal.toFixed(2)}`;
  }
}

// Matches backend OrderDTO.OrderItemDTO
export class OrderItemModel {
  constructor(data = {}) {
    this.orderItemId = data.orderItemId ?? null;
    this.productId = data.productId ?? null;
    this.productName = data.productName ?? '';
    this.primaryImageUrl = data.primaryImageUrl ?? null;
    this.quantity = data.quantity ?? 0;
    this.unitPrice = parseFloat(data.unitPrice ?? 0);
    this.lineTotal = parseFloat(data.lineTotal ?? 0);
  }

  get formattedLineTotal() {
    return `$${this.lineTotal.toFixed(2)}`;
  }
}

// Matches backend OrderDTO.ShippingAddressDTO
export class ShippingAddressModel {
  constructor(data = {}) {
    this.label = data.label ?? '';
    this.line1 = data.line1 ?? '';
    this.line2 = data.line2 ?? '';
    this.city = data.city ?? '';
    this.postalCode = data.postalCode ?? '';
    this.country = data.country ?? '';
  }

  get fullAddress() {
    return [this.line1, this.line2, this.city, this.postalCode, this.country]
      .filter(Boolean).join(', ');
  }
}

// Matches backend OrderDTO
export class OrderModel {
  constructor(data = {}) {
    this.orderId = data.orderId ?? null;
    this.status = data.status ?? '';
    this.subtotal = parseFloat(data.subtotal ?? 0);
    this.shippingFee = parseFloat(data.shippingFee ?? 0);
    this.discount = parseFloat(data.discount ?? 0);
    this.totalAmount = parseFloat(data.totalAmount ?? 0);
    this.paymentStatus = data.paymentStatus ?? null;
    this.paymentIntentId = data.paymentIntentId ?? null;
    this.orderItems = (data.orderItems ?? []).map((i) => new OrderItemModel(i));
    this.shippingAddress = data.shippingAddress ? new ShippingAddressModel(data.shippingAddress) : null;
    this.createdAt = data.createdAt ?? null;
  }

  get formattedTotal() {
    return `$${this.totalAmount.toFixed(2)}`;
  }

  get statusColor() {
    const map = {
      PENDING: 'warning',
      PROCESSING: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return map[this.status] ?? 'default';
  }
}
