import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/ui/Divider";
import GoogleButton from "../../components/auth/GoogleButton";
import { useAuth } from "../../contexts/AuthContext";
import NotificationService from "../../services/NotificationService";

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
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
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
        // Tampilkan notifikasi sukses
        NotificationService.show(
          "Login berhasil! Mengalihkan ke dashboard...",
          "success"
        );
        // Will redirect via the useEffect if successful
      } catch (error) {
        // Tampilkan pesan error yang spesifik
        let errorMessage = "Login gagal. Silakan coba lagi.";

        if (error.message && error.message.includes("Invalid login")) {
          errorMessage = "Email atau password salah. Silakan periksa kembali.";
        } else if (error.message && error.message.includes("network")) {
          errorMessage =
            "Koneksi internet terputus. Periksa koneksi Anda dan coba lagi.";
        } else if (error.message && error.message.includes("timeout")) {
          errorMessage = "Server tidak merespons. Silakan coba lagi nanti.";
        } else if (error.message && error.message.includes("not verified")) {
          errorMessage =
            "Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        NotificationService.show(errorMessage, "error");

        setErrors({
          ...errors,
          general: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Jika ada error validasi form, tampilkan notifikasi
      NotificationService.show("Mohon lengkapi form dengan benar", "warning");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthLayout heading="Login" subheading="Senang Anda kembali!">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Masukkan email Anda"
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
          placeholder="Masukkan password Anda"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex justify-between items-center mt-4 mb-6">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            label="Ingat saya"
            checked={formData.rememberMe}
            onChange={handleChange}
          />

          <Link
            to="/forgot-password"
            className="text-sm text-secondary hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sedang masuk..." : "Masuk"}
        </Button>
      </form>

      <Divider text="Atau" className="my-4" />

      <GoogleButton />

      <div className="mt-4 text-center">
        <p className="text-text-light">
          Belum punya akun?{" "}
          <Link to="/signup" className="text-secondary hover:underline">
            Daftar
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-500 border-opacity-30 flex justify-center space-x-4 text-xs text-text-light opacity-70">
        <Link to="/terms" className="hover:underline">
          Syarat & Ketentuan
        </Link>
        <Link to="/support" className="hover:underline">
          Bantuan
        </Link>
        <Link to="/customer-care" className="hover:underline">
          Layanan Pelanggan
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
