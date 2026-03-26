import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { StorageService } from '../../../core/storage/StorageService';
import { AuthResponseModel, UserModel } from '../models/AuthModels';

function login(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.login);
  req.body = body;
  return req
    .then((res) => {
      const auth = new AuthResponseModel(res.data);
      StorageService.setAccessToken(auth.accessToken);
      StorageService.setRefreshToken(auth.refreshToken);
      StorageService.set(StorageService.USER, auth.user);
      return auth;
    })
    .catch((err) => Promise.reject(err));
}

function register(body) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.auth.register);
  req.body = body;
  return req
    .then((res) => new AuthResponseModel(res.data))
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

export const authService = { login, register, forgotPassword, getMe, logout };
