import axios from 'axios';
import { API_ERROR_TYPES } from '../constants/apiErrorTypes';
import { StorageService } from '../storage/StorageService';
import { API_PATH } from './utils/ApiEndpoints';

const INTERCEPTOR_HANDLED_TYPES = new Set([
  API_ERROR_TYPES.INVALID_TOKEN,
  API_ERROR_TYPES.EXPIRED_TOKEN,
]);

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10_000,
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newAccessToken = null) {
  refreshQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(newAccessToken)));
  refreshQueue = [];
}

async function refreshAccessToken() {
  console.log("REFRESHTOKEN");
  
  const refreshToken = StorageService.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');
  console.log("REFRESHTOKEN");
  
  const response = await api.post(API_PATH.auth.refresh,{ refreshToken });
  const newRefreshToken =
    response.headers['x-refresh-token'] ||
    response.headers['refresh-token'] ||
    response.headers['authorization'];

  const accessToken =  response.headers['x-access-token'] ||  response.headers['access-token'] ;
  StorageService.setAccessToken(accessToken);

  if (newRefreshToken) StorageService.setRefreshToken(newRefreshToken);
  return accessToken;
}

api.interceptors.request.use(
  (config) => {
    const token = StorageService.getAccessToken();

    if (config.url === API_PATH.auth.refresh) {
      const refreshToken = StorageService.getRefreshToken();
      if (refreshToken) config.headers.Authorization = `Bearer ${refreshToken}`;
      return config;
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

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
        StorageService.clearStorage();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
