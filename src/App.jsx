import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AuthCallback from "./pages/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PracticePage from "./pages/belajar/PracticePage";
import PeringkatPage from "./pages/peringkat/PeringkatPage";
import ProfilePage from "./pages/pengaturan/ProfilePage";
import SusunKataPage from "./pages/Tantangan/SusunKataPage";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResendVerification from "./pages/auth/ResendVerification";
import EmailVerification from "./pages/auth/EmailVerification";
import { useAuth } from "./contexts/AuthContext";
import { LearningProvider } from "./contexts/LearningContext";

// Import presenters
import BelajarPresenter from "./presenters/BelajarPresenter";
import SubmodulePresenter from "./presenters/SubmodulePresenter";

// Komponen untuk menangani logout
const LogoutHandler = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Bersihkan localStorage terlebih dahulu untuk memastikan state bersih
        localStorage.removeItem("isyara_access_token");
        localStorage.removeItem("isyara_user");
        localStorage.removeItem("isyara_refresh_token");

        // Jika auth tersedia, panggil logout
        if (auth && auth.logout) {
          await auth.logout();
        }

        // Tunggu sebentar untuk memastikan proses selesai
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } catch (error) {
        console.error("Error signing out:", error);
        setError("Gagal keluar. Mencoba ulang...");

        // Jika gagal, coba lagi dengan pendekatan yang lebih sederhana
        setTimeout(() => {
          localStorage.clear(); // Bersihkan semua localStorage
          window.location.href = "/login"; // Hard redirect
        }, 2000);
      }
    };

    handleLogout();
  }, [auth, navigate]);

  return (
    <div className="bg-gradient-to-br from-background via-primary to-background flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Keluar dari aplikasi...</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

// Komponen untuk membungkus protected routes dengan LearningProvider
const ProtectedRoutesWithLearning = () => {
  return (
    <LearningProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/belajar" element={<BelajarPresenter />} />
        <Route path="/susun-kata" element={<SusunKataPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/praktek/:subModuleId" element={<PracticePage />} />
        <Route path="/praktek" element={<PracticePage />} />
        <Route path="/peringkat" element={<PeringkatPage />} />

        {/* Default protected route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LearningProvider>
  );
};

function App() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("App component mounted");
      console.log("Environment:", {
        NODE_ENV: import.meta.env.MODE,
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        hasApiUrl: !!import.meta.env.VITE_API_URL,
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/keluar" element={<LogoutHandler />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/verify/:token" element={<EmailVerification />} />

        {/* Protected Routes with Learning Context */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<ProtectedRoutesWithLearning />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
