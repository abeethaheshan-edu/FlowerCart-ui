import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { StorageService } from '../../../core/storage/StorageService';
import { AuthResponseModel, UserModel } from '../models/AuthModels';


function _storeAuthFromResponse(res) {
  const headers = res.headers ?? {};
  const accessToken = headers['x-access-token'] ?? res.data?.accessToken ?? null;
  const refreshToken = headers['x-refresh-token'] ?? res.data?.refreshToken ?? null;

  if (accessToken) StorageService.setAccessToken(accessToken);
  if (refreshToken) StorageService.setRefreshToken(refreshToken);

  const user = new UserModel(res.data);
  StorageService.set(StorageService.USER, user);
  return { accessToken, refreshToken, user };
}

function login(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.login);
  req.body = { email: body.email, password: body.password };
  return req
    .then((res) => {
      return _storeAuthFromResponse(res);
    })
    .catch((err) => Promise.reject(err));
}

function register(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.register);
  req.body = {
    email: body.email,
    password: body.password,
    fullName: `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim() || body.fullName,
    phone: body.phone ?? '',
  };
  return req
    .then((res) => {
      return _storeAuthFromResponse(res);
    })
    .catch((err) => Promise.reject(err));
}

function forgotPassword(email) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.forgotPassword);
  req.body = { email };
  return req
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

function getMe() {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.auth.me);
  return req
    .then((res) => new UserModel(res.data))
    .catch((err) => Promise.reject(err));
}

function logout() {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.logout);
  return req
    .then(() => StorageService.clearStorage())
    .catch(() => StorageService.clearStorage());
}

function getStoredUser() {
  const raw = StorageService.get(StorageService.USER);
  return raw ? new UserModel(raw) : null;
}

function isAuthenticated() {
  return !!StorageService.getAccessToken();
}

export const authService = { login, register, forgotPassword, getMe, logout, getStoredUser, isAuthenticated };
