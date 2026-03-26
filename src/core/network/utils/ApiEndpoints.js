export const API_PATH = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  products: {
    list: '/products',
    detail: '/products/{param1}',
  },
  orders: {
    my: '/orders/my',
    detail: '/orders/{param1}',
    adminList: '/admin/orders',
    adminDetail: '/admin/orders/{param1}',
    adminOrderItem: '/admin/orders/{param1}/items/{param2}',
    attachments: '/orders/{param1}/attachments',
    itemPhotos: '/orders/{param1}/items/{param2}/photos',
  },
};
