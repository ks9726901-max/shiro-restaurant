import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://shiro-restaurant.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shiro_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage if token expired or invalid
      localStorage.removeItem('shiro_token');
      localStorage.removeItem('shiro_user');
      // Redirect to login if user is in dashboard area
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
