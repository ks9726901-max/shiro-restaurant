import axios from 'axios';

// Determine API Host dynamically
export const API_HOST = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:5000' 
      : 'https://shiro-restaurant.onrender.com');

// Create axios instance
const api = axios.create({
  baseURL: `${API_HOST}/api`,
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
