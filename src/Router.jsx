import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import AdminLayout from './core/layouts/AdminLayout';
import CustomerLayout from './core/layouts/CustomerLayout';
import AuthLayout from './core/layouts/AuthLayout';

import LoginScreen from './features/auth/screens/LoginScreen';
import RegisterScreen from './features/auth/screens/RegisterScreen';
import ForgotPasswordScreen from './features/auth/screens/ForgotPasswordScreen';

import HomeScreen from './features/customer/screens/HomeScreen';
import AccountDashboardScreen from './features/customer/screens/AccountDashboardScreen';
import WishlistScreen from './features/customer/screens/WishlistScreen';

import ShopScreen from './features/products/screens/ShopScreen';
import ProductDetailScreen from './features/products/screens/ProductDetailScreen';
import AdminProductsScreen from './features/products/screens/AdminProductsScreen';

import CartScreen from './features/checkout/screens/CartScreen';
import CheckoutScreen from './features/checkout/screens/CheckoutScreen';

import OrdersScreen from './features/order/customer/screens/OrdersScreen';
import OrderTrackingScreen from './features/order/customer/screens/OrderTrackingScreen';
import AdminOrdersScreen from './features/order/admin/screens/AdminOrdersScreen';

import AdminDashboardScreen from './features/dashboard/screens/AdminDashboardScreen';
import AdminAnalyticsScreen from './features/analytics/screens/AdminAnalyticsScreen';
import AdminInventoryScreen from './features/inventroy/screens/AdminInventoryScreen';
import AdminSupportScreen from './features/supports/screens/AdminSupportScreen';
import AdminSettingsScreen from './features/settings/screens/AdminSettingsScreen';

import ComponentLibrary from './features/library/ComponentLibrary';


const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: 'shop', element: <ShopScreen /> },
      { path: 'bouquets', element: <ShopScreen /> },
      { path: 'occasions', element: <ShopScreen /> },
      { path: 'plants', element: <ShopScreen /> },
      { path: 'gifts', element: <ShopScreen /> },
      { path: 'product/:id', element: <ProductDetailScreen /> },
      { path: 'cart', element: <CartScreen /> },
      { path: 'checkout', element: <CheckoutScreen /> },
      { path: 'wishlist', element: <WishlistScreen /> },
      {
        path: 'account',
        children: [
          { index: true, element: <AccountDashboardScreen /> },
          { path: 'orders', element: <OrdersScreen /> },
          { path: 'orders/:id/track', element: <OrderTrackingScreen /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <LoginScreen /> },
      { path: 'register', element: <RegisterScreen /> },
      { path: 'forgot-password', element: <ForgotPasswordScreen /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardScreen /> },
      { path: 'products', element: <AdminProductsScreen /> },
      { path: 'orders', element: <AdminOrdersScreen /> },
      { path: 'inventory', element: <AdminInventoryScreen /> },
      { path: 'analytics', element: <AdminAnalyticsScreen /> },
      { path: 'support', element: <AdminSupportScreen /> },
      { path: 'settings', element: <AdminSettingsScreen /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
  { path: 'library', element: <ComponentLibrary /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
