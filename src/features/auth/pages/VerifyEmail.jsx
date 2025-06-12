import React from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../../common/components/layout/AuthLayout";
import Button from "../../../common/components/ui/Button";

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <AuthLayout heading="Verifikasi Email" subheading="Hampir selesai!">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <p className="text-text-light mb-4">
          Kami telah mengirimkan link verifikasi ke email{" "}
          <span className="font-bold">{email}</span>
        </p>

        <p className="text-text-light text-sm mb-6">
          Silakan cek kotak masuk atau folder spam Anda dan klik link verifikasi
          untuk mengaktifkan akun Anda.
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => window.open("https://mail.google.com/", "_blank")}
          >
            Buka Email
          </Button>

          <Link to="/login">
            <Button variant="outline" fullWidth>
              Kembali ke Login
            </Button>
          </Link>
        </div>

        <p className="text-text-light text-xs mt-6">
          Tidak menerima email? Periksa folder spam atau{" "}
          <Link
            to="/resend-verification"
            className="text-secondary hover:underline"
          >
            kirim ulang email verifikasi
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
