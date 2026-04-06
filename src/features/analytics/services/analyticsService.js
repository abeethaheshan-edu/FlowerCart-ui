import apiClient from '../../../core/network/ApiClient';

function getSummary() {
  const req = apiClient.get();
  req.url = '/admin/analytics';
  return req
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

export const analyticsService = { getSummary };
