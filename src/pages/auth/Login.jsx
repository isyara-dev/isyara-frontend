import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (formData) => {
    // This is where you would normally make an API call to authenticate the user
    console.log('Login form submitted:', formData);
    
    // For demo purposes, simulate a successful login
    toast.success('Login successful!');
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    // This is where you would handle Google OAuth login
    console.log('Google login initiated');
    
    // For demo purposes, simulate a successful login
    toast.success('Google login successful!');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
    </AuthLayout>
  );
};

export default Login; 