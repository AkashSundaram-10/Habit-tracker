import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://habit-tracker-production-ab16.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/api/habits'),
  getById: (id) => api.get(`/api/habits/${id}`),
  create: (data) => api.post('/api/habits', data),
  update: (id, data) => api.put(`/api/habits/${id}`, data),
  delete: (id) => api.delete(`/api/habits/${id}`),
};

// Tracking API
export const trackingAPI = {
  getToday: () => api.get('/api/tracking/today'),
  getByDate: (date) => api.get(`/api/tracking/date/${date}`),
  complete: (data) => api.post('/api/tracking/complete', data),
  toggle: (data) => api.post('/api/tracking/toggle', data),
  getStreak: (habitId) => api.get(`/api/tracking/streak/${habitId}`),
  getStats: (habitId, period = 'week') => api.get(`/api/tracking/stats/${habitId}`, { params: { period } }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/api/tracking/analytics/overview'),
  getCalendarData: (month) => api.get(`/api/tracking/analytics/calendar/${month}`),
};

export default api;
