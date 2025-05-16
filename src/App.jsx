import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardPage from './pages/dashboard/DashboardPage';
import AuthCallback from './pages/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TestSupabase from './pages/TestSupabase';

function App() {
  useEffect(() => {
    console.log('App component mounted');
    // Log any environment variables (without exposing sensitive data)
    console.log('Environment:', {
      NODE_ENV: import.meta.env.MODE,
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasApiUrl: !!import.meta.env.VITE_API_URL,
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/test-supabase" element={<TestSupabase />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add more protected routes here */}
        </Route>
        
        {/* Redirect to login page for unauthenticated users and to dashboard for authenticated ones */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
