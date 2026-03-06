import axios from 'axios';
import { API_ERROR_TYPES } from '../constants/apiErrorTypes';
import { StorageService } from '../storage/StorageService';
import { API_PATH } from './ApiEndpoints';

const INTERCEPTOR_HANDLED_TYPES = new Set([
  API_ERROR_TYPES.INVALID_TOKEN,
  API_ERROR_TYPES.EXPIRED_TOKEN,
]);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newAccessToken = null) {
  refreshQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(newAccessToken)));
  refreshQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = StorageService.getRefresh();
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await axios.post(API_PATH.auth.refresh, { refreshToken });

  StorageService.setAccessToken(data.accessToken);
  StorageService.setRefreshToken(data.refreshToken);

  return data.accessToken;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = StorageService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

//Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const body = error.response?.data;

    const errorType = body?.type ?? null;

    const isTokenError =
      (status === 401 || status === 500) && INTERCEPTOR_HANDLED_TYPES.has(errorType);

    if (isTokenError && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();

        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
