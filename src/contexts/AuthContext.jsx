import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import authService from '../services/auth/authService';
import supabase from '../services/supabaseClient';

// Create the auth context
const AuthContext = createContext();

// Set this to true for development, false for production
const DEBUG_MODE = false;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // For debouncing
  const saveInProgressRef = useRef(false);
  const timeoutRef = useRef(null);
  
  // Track user ID that we've already saved to backend
  const savedUserIdRef = useRef(null);
  // Track if initial load has been done
  const initialLoadDoneRef = useRef(false);

  // Custom logger that only logs in debug mode
  const logger = useCallback((message, ...args) => {
    if (DEBUG_MODE) {
      console.log(message, ...args);
    }
  }, []);

  // Create a stable debounced save function with useCallback
  const saveGoogleUser = useCallback(async (user, eventType) => {
    // If we've already saved this user ID and it's not a fresh login, don't save again
    if (savedUserIdRef.current === user.id && initialLoadDoneRef.current) {
      logger(`User ${user.id} already saved, skipping backend request`);
      // Still update the UI state if needed
      if (!currentUser || currentUser.id !== user.id) {
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url
        });
        setIsAuthenticated(true);
      }
      return;
    }
    
    // Cancel any pending operations
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Return early if already processing
    if (saveInProgressRef.current) {
      return;
    }
    
    // Set a short timeout to debounce multiple events
    timeoutRef.current = setTimeout(async () => {
      if (saveInProgressRef.current) return;
      
      saveInProgressRef.current = true;
      
      try {
        logger(`Processing auth event: ${eventType} for user ${user.id}`);
        
        const userData = await authService.saveGoogleUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url
        });
        
        // Mark this user as saved
        savedUserIdRef.current = user.id;
        setCurrentUser(userData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error saving Google user:', error);
        
        // Still set the user from session if saving failed
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url
        });
        setIsAuthenticated(true);
        // Still mark as saved to prevent future attempts
        savedUserIdRef.current = user.id;
      } finally {
        saveInProgressRef.current = false;
      }
    }, 200);
  }, [currentUser, logger]);

  // Handle auth state changes - with selective processing
  useEffect(() => {
    let authListener = null;
    
    const setupAuth = async () => {
      try {
        // First, check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await saveGoogleUser(session.user, 'INITIAL_SESSION');
        } else {
          // Check local storage as fallback
          const localUser = authService.getCurrentUser();
          if (localUser) {
            setCurrentUser(localUser);
            setIsAuthenticated(true);
            savedUserIdRef.current = localUser.id;
          }
        }
        
        // Mark initial load as complete
        initialLoadDoneRef.current = true;
        
        // Set up a single auth listener
        const { data } = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            logger('Auth event:', event);
            
            if (event === 'SIGNED_OUT') {
              setCurrentUser(null);
              setIsAuthenticated(false);
              savedUserIdRef.current = null;
              return;
            }
            
            // Only process SIGNED_IN events - ignore TOKEN_REFRESHED, etc.
            if (session && event === 'SIGNED_IN') {
              // Don't save again if we've already saved this user ID
              if (savedUserIdRef.current !== session.user.id) {
                await saveGoogleUser(session.user, event);
              } else {
                logger(`User ${session.user.id} already saved, ignoring duplicate SIGNED_IN event`);
              }
            }
          }
        );
        
        authListener = data.subscription;
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    setupAuth();
    
    // Clean up
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [saveGoogleUser, logger]);

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