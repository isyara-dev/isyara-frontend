import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth/authService';

// Create the auth context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = authService.getCurrentUser();
        
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login method
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register method
  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.register(name, email, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Social login methods
  const googleLogin = () => {
    authService.googleLogin();
  };

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 