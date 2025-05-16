import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth/authService';
import supabase from '../services/supabaseClient';

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
        // Check for existing session in Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const user = session.user;
          // Save user data to backend and get full user profile
          try {
            const userData = await authService.saveGoogleUser({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url
            });
            setCurrentUser(userData.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error saving Google user:', error);
          }
        } else {
          // Check for user in local storage
          const localUser = authService.getCurrentUser();
          if (localUser) {
            setCurrentUser(localUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Set up Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = session.user;
          try {
            const userData = await authService.saveGoogleUser({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url
            });
            setCurrentUser(userData.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error saving Google user:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
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
  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear local storage
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  // Google login method
  const googleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to sign in with Google');
      throw error;
    }
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