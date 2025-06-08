import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/ui/Divider";
import GoogleButton from "../../components/auth/GoogleButton";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset form dan error ketika komponen mounts atau saat berpindah halaman
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
  }, [location.pathname]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password);
        // Will redirect via the useEffect if successful
      } catch (error) {
        setErrors({
          ...errors,
          general: error.message || "Login failed. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthLayout heading="Login" subheading="Glad you're back!">
      <form onSubmit={handleSubmit} className="space-y-3">
        {(errors.general || authError) && (
          <div className="border border-red-500 text-white bg-red-500 px-4 py-2 rounded mb-2 text-sm">
            {errors.general || authError || "Login gagal. Silakan coba lagi."}
          </div>
        )}

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

        <div className="flex justify-between items-center mt-4 mb-6">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            label="Remember me"
            checked={formData.rememberMe}
            onChange={handleChange}
          />

          <Link
            to="/forgot-password"
            className="text-sm text-secondary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <Divider text="Or" className="my-4" />

      <GoogleButton />

      <div className="mt-4 text-center">
        <p className="text-text-light">
          Don't have an account?{" "}
          <Link to="/signup" className="text-secondary hover:underline">
            Signup
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-500 border-opacity-30 flex justify-center space-x-4 text-xs text-text-light opacity-70">
        <Link to="/terms" className="hover:underline">
          Terms & Conditions
        </Link>
        <Link to="/support" className="hover:underline">
          Support
        </Link>
        <Link to="/customer-care" className="hover:underline">
          Customer Care
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
