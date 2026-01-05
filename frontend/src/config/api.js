import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Try customerToken first (for regular users), then token (for admin)
  const customerToken = localStorage.getItem('customerToken');
  const adminToken = localStorage.getItem('token');
  const token = customerToken || adminToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('customerToken');
      localStorage.removeItem('token');
      // Don't redirect here, let the component handle it
    }
    return Promise.reject(error);
  }
);

export default api;
