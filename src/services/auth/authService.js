// This file will handle authentication with the Express backend and Supabase

// Set the API base URL - to be updated with actual backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Local storage keys
const USER_KEY = 'isyara_user';
const TOKEN_KEY = 'isyara_token';

// Helper to store user data in local storage
const storeUserData = (userData, token) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(TOKEN_KEY, token);
};

// Helper to clear user data from local storage
const clearUserData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// Get the current authenticated user from local storage
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get the auth token from local storage
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Register a new user with email and password
const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    if (data.user && data.token) {
      storeUserData(data.user, data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login with email and password
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.user && data.token) {
      storeUserData(data.user, data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout the user
const logout = () => {
  clearUserData();
  // You can add additional cleanup here if needed
};

// Google OAuth login
const googleLogin = () => {
  // Will be implemented to integrate with Google OAuth
  window.location.href = `${API_URL}/auth/google`;
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  googleLogin,
};

export default authService; 