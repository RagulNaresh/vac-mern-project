import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: '', // Using Vite proxy to forward /api and /uploads to port 5000
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('localguide_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected actions, optional token clear
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API HELPER SERVICES
// ==========================================

export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me')
};

export const experienceService = {
  getAll: (params) => api.get('/api/experiences', { params }),
  getById: (id) => api.get(`/api/experiences/${id}`),
  create: (formData) => api.post('/api/experiences', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/experiences/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/experiences/${id}`)
};

export const bookingService = {
  create: (bookingData) => api.post('/api/bookings', bookingData),
  getMyBookings: () => api.get('/api/bookings/my'),
  cancel: (id) => api.put(`/api/bookings/${id}/cancel`),
  getGuideBookings: () => api.get('/api/bookings/guide')
};

export const reviewService = {
  add: (reviewData) => api.post('/api/reviews', reviewData),
  getByExperience: (experienceId) => api.get(`/api/reviews/${experienceId}`)
};

export const adminService = {
  getUsers: () => api.get('/api/users'),
  deleteUser: (id) => api.delete(`/api/users/${id}`)
};

export default api;
