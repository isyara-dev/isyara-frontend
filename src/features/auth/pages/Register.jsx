import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../../common/components/layout/AuthLayout";
import Input from "../../../common/components/ui/Input";
import Button from "../../../common/components/ui/Button";
import Divider from "../../../common/components/ui/Divider";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../../../contexts/AuthContext";
import NotificationService from "../../../services/NotificationService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset form dan error ketika komponen mounts atau saat berpindah halaman
  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  }, [location.pathname]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Basic validation
    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      // Validasi username hanya boleh berisi huruf, angka, dan underscore
      newErrors.username =
        "Username hanya boleh berisi huruf, angka, dan underscore";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
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
        await register(formData.username, formData.email, formData.password);
        // Tampilkan notifikasi sukses
        NotificationService.show(
          "Pendaftaran berhasil! Silakan verifikasi email Anda.",
          "success"
        );
        // Arahkan ke halaman verifikasi setelah berhasil mendaftar
        navigate("/verify-email", { state: { email: formData.email } });
      } catch (error) {
        // Tampilkan pesan error yang spesifik
        let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";

        if (error.message && error.message.includes("already registered")) {
          errorMessage =
            "Email sudah terdaftar. Silakan gunakan email lain atau login dengan email tersebut.";
          setErrors({
            ...errors,
            email: "Email sudah terdaftar",
          });
        } else if (error.message && error.message.includes("already exists")) {
          errorMessage =
            "Username sudah digunakan. Silakan pilih username lain.";
          setErrors({
            ...errors,
            username: "Username sudah digunakan",
          });
        } else if (error.message && error.message.includes("network")) {
          errorMessage =
            "Koneksi internet terputus. Periksa koneksi Anda dan coba lagi.";
        } else if (error.message && error.message.includes("timeout")) {
          errorMessage = "Server tidak merespons. Silakan coba lagi nanti.";
        } else if (
          error.message &&
          error.message.includes("invalid username")
        ) {
          errorMessage =
            "Username hanya boleh berisi huruf, angka, dan underscore.";
          setErrors({
            ...errors,
            username:
              "Username hanya boleh berisi huruf, angka, dan underscore",
          });
        } else if (error.message) {
          errorMessage = error.message;
        }

        NotificationService.show(errorMessage, "error");

        setErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Jika ada error validasi form, tampilkan notifikasi
      NotificationService.show("Mohon lengkapi form dengan benar", "warning");
    }
  };

  return (
    <AuthLayout heading="Daftar" subheading="Selamat Datang">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="username"
          name="username"
          label="Username"
          placeholder="Masukkan username Anda"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          hint="Username hanya boleh berisi huruf, angka, dan underscore"
        />

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

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Konfirmasi Password"
          placeholder="Konfirmasi password Anda"
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
            {isSubmitting ? "Sedang mendaftar..." : "Daftar"}
          </Button>
        </div>
      </form>

      <Divider text="Atau" className="my-6" />

      <GoogleButton />

      <div className="mt-6 text-center">
        <p className="text-text-light">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-secondary hover:underline">
            Masuk
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-500 border-opacity-30 flex justify-center space-x-4 text-xs text-text-light opacity-70">
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

export default Register;
