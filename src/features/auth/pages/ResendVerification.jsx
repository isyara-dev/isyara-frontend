import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../common/components/layout/AuthLayout";
import Input from "../../../common/components/ui/Input";
import Button from "../../../common/components/ui/Button";
import authService from "../../../services/auth/authService";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await authService.resendVerificationEmail(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message || "Gagal mengirim email verifikasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Kirim Ulang Verifikasi"
      subheading="Masukkan email Anda untuk menerima link verifikasi baru"
    >
      {success ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="text-text-light mb-4">
            Email verifikasi telah dikirim ke{" "}
            <span className="font-bold">{email}</span>
          </p>

          <Link to="/login">
            <Button variant="primary" fullWidth>
              Kembali ke Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border border-red-500 text-white bg-red-500 px-4 py-2 rounded mb-2 text-sm">
              {error}
            </div>
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mengirim..." : "Kirim Link Verifikasi"}
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-secondary hover:underline text-sm"
            >
              Kembali ke Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResendVerification;
