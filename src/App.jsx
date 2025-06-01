import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AuthCallback from "./pages/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BelajarPage from "./pages/belajar/BelajarPage";
import ModulePage from "./pages/module/ModulePage";
import ProfilePage from "./pages/profile/ProfilePage";
import SusunKataPage from "./pages/susunkata/SusunKataPage";
import PracticePage from "./pages/practice/PracticePage";
import PeringkatPage from "./pages/peringkat/peringkatPage";

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

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/belajar" element={<BelajarPage />} />
          <Route path="/modul" element={<ModulePage />} />
          <Route path="/susun-kata" element={<SusunKataPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/praktek" element={<PracticePage />} />
          <Route path="/peringkat" element={<PeringkatPage />} />

          {/* Default protected route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
