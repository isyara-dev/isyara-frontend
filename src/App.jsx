import React, { useEffect } from "react";
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
import BelajarPage from "./pages/belajar/BelajarPage";
import SubmodulePage from "./pages/belajar/SubmodulePage";
import ProfilePage from "./pages/pengaturan/ProfilePage";
import SusunKataPage from "./pages/Tantangan/SusunKataPage";
import PracticePage from "./pages/belajar/PracticePage";
import PeringkatPage from "./pages/peringkat/peringkatPage";
import { useAuth } from "./contexts/AuthContext";
import { LearningProvider } from "./contexts/LearningContext";

// Komponen untuk menangani logout
const LogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Error signing out:", error);
        navigate("/login");
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
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
        <Route path="/belajar" element={<BelajarPage />} />
        <Route path="/belajar/submodul/:moduleId" element={<SubmodulePage />} />
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
