import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token is valid on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token is expired
            logout();
          } else {
            // Token is valid, get current user
            const response = await authService.getCurrentUser(token);
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      const { token, data } = response;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setToken(token);
      setUser(data);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'An error occurred during login');
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      const { token, data } = response;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setToken(token);
      setUser(data);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'An error occurred during registration');
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Update state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(userData, token);
      setUser(response.data);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'An error occurred while updating profile');
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.updatePassword(passwordData, token);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'An error occurred while updating password');
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};