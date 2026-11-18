import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const receipts = {
  create: (data) => api.post('/receipts', data),
  list: (params) => api.get('/receipts', { params }),
  get: (id) => api.get(`/receipts/${id}`),
  pdf: (id) => api.get(`/receipts/${id}/pdf`, { responseType: 'blob' }),
  markViewed: (id) => api.post(`/receipts/${id}/viewed`),
};

export default api;