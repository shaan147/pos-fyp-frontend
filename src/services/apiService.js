import axios from 'axios';

const API_URL = '/api';

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = 
      error.response?.data?.error?.message || 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Could trigger a logout action here
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;