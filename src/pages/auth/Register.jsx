import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (formData) => {
    // This is where you would normally make an API call to register the user
    console.log('Register form submitted:', formData);
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // For demo purposes, simulate a successful registration
    toast.success('Registration successful!');
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    // This is where you would handle Google OAuth login/signup
    console.log('Google signup initiated');
    
    // For demo purposes, simulate a successful registration
    toast.success('Google signup successful!');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <RegisterForm onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} />
    </AuthLayout>
  );
};

export default Register; 