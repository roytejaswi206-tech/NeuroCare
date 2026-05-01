import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Health API
export const healthAPI = {
  addHealthData: (data) => api.post('/health/data', data),
  getHealthData: (params) => api.get('/health/data', { params }),
  deleteHealthData: (id) => api.delete(`/health/data/${id}`),
  getLatestHealthData: () => api.get('/health/data/latest'),
  getHealthStats: () => api.get('/health/stats'),
};

// Predict API
export const predictAPI = {
  predict: (data) => api.post('/predict', data),
  getHistory: () => api.get('/predict/history'),
};

// Chat API
export const chatAPI = {
  chat: (message) => api.post('/chat', { message }),
  getQuickResponses: () => api.get('/chat/quick'),
};

// Hospitals API
export const hospitalsAPI = {
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospital: (id) => api.get(`/hospitals/${id}`),
  getHospitalDoctors: (id) => api.get(`/hospitals/${id}/doctors`),
  getAllDoctors: (params) => api.get('/hospitals/doctors', { params }),
  searchHospitals: (query) => api.get('/hospitals/search', { params: { q: query } }),
};

export default api;
