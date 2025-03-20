import api from './apiService';

export const authService = {
  // Login user
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  // Register user
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    return api.put('/auth/updatedetails', userData);
  },
  
  // Update user password
  updatePassword: async (passwordData) => {
    return api.put('/auth/updatepassword', passwordData);
  },
  
  // Logout user
  logout: async () => {
    return api.get('/auth/logout');
  }
};