import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
  createPanicAlert: (data) => api.post('/hospitals/panic', data),
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  createAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (appointmentId, data) => api.patch(`/appointments/${appointmentId}`, data),
};

// Places API
export const placesAPI = {
  nearby: (params) => api.get('/places/nearby', { params }),
  savePlace: (data) => api.post('/places/save', data),
  getSaved: () => api.get('/places/saved'),
  deleteFavorite: (id) => api.delete(`/places/saved/${id}`),
  panic: (data) => api.post('/places/panic', data),
  getFavorites: () => api.get('/places/saved'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getHospitals: () => api.get('/admin/hospitals'),
  createHospital: (data) => api.post('/admin/hospitals', data),
  updateHospital: (id, data) => api.patch(`/admin/hospitals/${id}`, data),
  deleteHospital: (id) => api.delete(`/admin/hospitals/${id}`),
  getDoctors: () => api.get('/admin/doctors'),
  createDoctor: (data) => api.post('/admin/doctors', data),
  updateDoctor: (id, data) => api.patch(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getPanicAlerts: () => api.get('/admin/panic-alerts'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
};

export default api;
