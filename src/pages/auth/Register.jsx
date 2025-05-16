import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Divider from '../../components/ui/Divider';
import GoogleButton from '../../components/auth/GoogleButton';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Reset form when component mounts
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  }, []);
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await register(formData.name, formData.email, formData.password);
        // Will redirect via the useEffect if successful
      } catch (error) {
        setErrors({
          ...errors,
          general: error.message || 'Registration failed. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <AuthLayout 
      heading="Sign Up" 
      subheading="Hey Welcome"
    >
      <form onSubmit={handleSubmit}>
        {(errors.general || authError) && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {errors.general || authError}
          </div>
        )}
      
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </div>
      </form>
      
      <Divider text="Or" className="my-6" />
      
      <GoogleButton />
      
      <div className="mt-6 text-center">
        <p className="text-text-light">
          Already Have an Account?{' '}
          <Link to="/login" className="text-secondary hover:underline">
            Log in
          </Link>
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-500 border-opacity-30 flex justify-center space-x-4 text-xs text-text-light opacity-70">
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <Link to="/support" className="hover:underline">Support</Link>
        <Link to="/customer-care" className="hover:underline">Customer Care</Link>
      </div>
    </AuthLayout>
  );
};

export default Register; 