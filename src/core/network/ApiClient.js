import { api } from './networkIntersepter';
import { ApiResponse, ApiError } from './models/ApiModels';

export const ContentType = Object.freeze({
  JSON: 'application/json',
  MULTIPART: 'multipart/form-data',
  FORM: 'application/x-www-form-urlencoded',
});

export class ApiRequest {
  constructor(method) {
    this._method = method;
    this.url = '';
    this.body = null;
    this.contentType = ContentType.JSON;
    this.headers = {};
    this.query = null;
    this.timeout = undefined;
    this._formData = null;
    this._promise = null;
  }

  addField(name, value) {
    this._ensureFormData();
    this._formData.append(name, String(value));
    return this;
  }

  addFile(fieldName, file, filename) {
    this._ensureFormData();
    filename
      ? this._formData.append(fieldName, file, filename)
      : this._formData.append(fieldName, file);
    return this;
  }

  _ensureFormData() {
    if (!this._formData) this._formData = new FormData();
  }

  _buildHeaders() {
    console.log(this.contentType);
    
    const headers = { 'Content-Type': this.contentType, ...this.headers };
    if (this.contentType === ContentType.MULTIPART) delete headers['Content-Type'];
    return headers;
  }

  _buildBody() {
    if (this.contentType === ContentType.MULTIPART) return this._formData ?? new FormData();
    return this.body ?? {};
  }

  _buildConfig() {
    const hasBody = !['GET', 'DELETE'].includes(this._method);
    const config = {
      method: this._method,
      url: this.url,
      headers: this._buildHeaders(),
    };
    if (this.query) config.params = this.query;
    if (this.timeout) config.timeout = this.timeout;
    if (hasBody) config.data = this._buildBody();
    return config;
  }

  _getPromise() {
    if (this._promise) return this._promise;
    this._promise = api(this._buildConfig())
      .then((response) => new ApiResponse(response.data, response.status, response.headers))
      .catch((err) => {
        const res = err.response;
        const status = res?.status ?? null;
        const data = res?.data ?? null;
        const errorType = data?.type ?? null;
        const message = data?.message ?? err.message ?? 'Something went wrong';
        const uiMessage = status ? `Error ${status}: ${message}` : `Network error: ${message}`;
        return Promise.reject(new ApiError(uiMessage, status, data, errorType));
      });
    return this._promise;
  }

  then(onFulfilled, onRejected) { return this._getPromise().then(onFulfilled, onRejected); }
  catch(onRejected) { return this._getPromise().catch(onRejected); }
  finally(onFinally) { return this._getPromise().finally(onFinally); }
}

const apiClient = {
  get() { return new ApiRequest('GET'); },
  post() { return new ApiRequest('POST'); },
  put() { return new ApiRequest('PUT'); },
  patch() { return new ApiRequest('PATCH'); },
  delete() { return new ApiRequest('DELETE'); },
};

export default apiClient;
