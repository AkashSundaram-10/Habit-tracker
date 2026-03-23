import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
};

// Tracking API
export const trackingAPI = {
  getToday: () => api.get('/tracking/today'),
  getByDate: (date) => api.get(`/tracking/date/${date}`),
  complete: (data) => api.post('/tracking/complete', data),
  toggle: (data) => api.post('/tracking/toggle', data),
  getStreak: (habitId) => api.get(`/tracking/streak/${habitId}`),
  getStats: (habitId, period = 'week') => api.get(`/tracking/stats/${habitId}`, { params: { period } }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/tracking/analytics/overview'),
  getCalendarData: (month) => api.get(`/tracking/analytics/calendar/${month}`),
};

export default api;
