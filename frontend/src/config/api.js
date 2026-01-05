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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-remove tokens here, let components handle it
    // This prevents race conditions with AuthContext
    return Promise.reject(error);
  }
);

export default api;
