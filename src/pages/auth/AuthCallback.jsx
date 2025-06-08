import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [processingAuth, setProcessingAuth] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Hindari pemrosesan berulang
      if (processingAuth) return;
      setProcessingAuth(true);

      try {
        // Tunggu sebentar untuk memastikan AuthContext telah memproses sesi
        setTimeout(() => {
          // Periksa apakah auth tersedia dan isAuthenticated ada
          if (auth && auth.isAuthenticated) {
            navigate("/dashboard");
          } else {
            // Jika tidak, coba periksa sesi secara manual
            supabase.auth.getSession().then(({ data, error }) => {
              if (error) {
                console.error("Auth callback error:", error);
                navigate("/login");
                return;
              }

              if (data && data.session) {
                // Tambahkan field name ke user data
                const enhancedUserData = {
                  ...data.session.user,
                  name:
                    data.session.user.user_metadata?.full_name ||
                    data.session.user.email,
                };

                // Simpan token dan data user yang sudah ditambahkan name
                localStorage.setItem(
                  "isyara_access_token",
                  data.session.access_token
                );
                localStorage.setItem(
                  "isyara_user",
                  JSON.stringify(enhancedUserData)
                );

                navigate("/dashboard");
              } else {
                navigate("/login");
              }
            });
          }
        }, 800); // Tambah waktu tunggu untuk memastikan AuthContext sudah memproses sesi
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, auth, processingAuth]);

  return (
    <div className="bg-gradient-to-br from-background via-primary to-background flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
