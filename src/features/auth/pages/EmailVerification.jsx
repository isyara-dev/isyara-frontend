import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../../common/components/layout/AuthLayout";
import Button from "../../../common/components/ui/Button";
import authService from "../../../services/auth/authService";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setError("Token verifikasi tidak valid");
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
        // Redirect ke dashboard setelah 3 detik
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setError(error.message || "Verifikasi email gagal");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <AuthLayout
      heading="Verifikasi Email"
      subheading={
        status === "verifying"
          ? "Memverifikasi email Anda..."
          : status === "success"
          ? "Email berhasil diverifikasi!"
          : "Verifikasi email gagal"
      }
    >
      <div className="text-center space-y-4">
        {status === "verifying" && (
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-12 w-12 text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {status === "success" && (
          <>
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
              Email Anda telah berhasil diverifikasi. Anda akan diarahkan ke
              dashboard dalam beberapa detik.
            </p>

            <Link to="/dashboard">
              <Button variant="primary" fullWidth>
                Lanjut ke Dashboard
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <p className="text-text-light mb-4">{error}</p>

            <Link to="/resend-verification">
              <Button variant="primary" fullWidth>
                Kirim Ulang Verifikasi
              </Button>
            </Link>

            <div className="mt-4">
              <Link to="/login" className="text-secondary hover:underline">
                Kembali ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
