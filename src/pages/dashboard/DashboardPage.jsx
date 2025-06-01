import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import apiClient from "../../services/api/apiClient";

// Separate sidebar component to avoid hook issues
const Sidebar = ({ onLogout }) => (
  <div className="w-64 bg-blue-900 p-6 flex flex-col">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-yellow-400">ISYARA</h1>
    </div>
    <nav className="space-y-2">
      <Link to="/belajar" className="block">
        <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
          BELAJAR
        </div>
      </Link>
      <Link to="/papan-skor" className="block">
        <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
          PAPAN SKOR
        </div>
      </Link>
      <Link to="/dashboard" className="block">
        <div className="bg-yellow-400 text-black px-4 py-3 rounded-lg font-medium">
          PROFILE
        </div>
      </Link>
      <Link to="/pengaturan" className="block">
        <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
          PENGATURAN
        </div>
      </Link>
      <div
        className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer"
        onClick={onLogout}
      >
        KELUAR
      </div>
    </nav>
    <div className="mt-auto">
      <div className="text-yellow-400 text-sm">ISYARA</div>
      <div className="text-blue-300 text-xs">dicoding</div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    username: "loading",
    score: 0,
    avatarUrl: "/profile-avatar.png",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const profileFetchedRef = useRef(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check authentication status once
  useEffect(() => {
    // Only redirect if we've confirmed user is not authenticated
    if (!isAuthenticated && authChecked) {
      navigate("/login");
    }

    // Mark auth as checked after first render
    if (!authChecked) {
      setAuthChecked(true);
    }
  }, [isAuthenticated, authChecked, navigate]);

  // Fetch user profile directly from API to get the latest score
  const fetchUserProfile = useCallback(async () => {
    // Gunakan ref untuk mencegah multiple fetching
    if (profileFetchedRef.current) return;

    try {
      console.log("Fetching user profile from API...");
      profileFetchedRef.current = true; // Set flag sebelum fetch

      const userData = await apiClient.getUserProfile();
      if (userData) {
        console.log("User profile fetched:", userData);
        setUserProfile((prev) => ({
          ...prev,
          name: userData.name || "User",
          username: userData.username || "username",
          score: userData.score || 0,
          avatarUrl: userData.avatar_url || "/profile-avatar.png",
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []); // Hapus semua dependensi untuk mencegah re-create function

  // Use a separate effect for setting up user profile from currentUser and API
  useEffect(() => {
    if (currentUser && !profileFetchedRef.current) {
      // Set initial profile from currentUser
      setUserProfile((prev) => ({
        ...prev,
        name: currentUser.name || "User",
        username: currentUser.username || "username",
        avatarUrl: currentUser.avatar_url || "/profile-avatar.png",
      }));

      // Fetch profile hanya sekali
      fetchUserProfile();
    }
  }, [currentUser, fetchUserProfile]);

  // Separate effect for fetching language data - only runs once
  useEffect(() => {
    // Only fetch data once
    if (dataFetched) return;

    const fetchData = async () => {
      try {
        // Log once, not on every render
        const token = localStorage.getItem("isyara_access_token");
        console.log(
          "Access Token check (once):",
          token ? `${token.substring(0, 20)}...` : "No token found"
        );

        // Gunakan apiClient untuk mengambil data bahasa dari backend
        // Jika endpoint belum tersedia, gunakan mock data sementara
        let languagesData = [];

        try {
          // Coba ambil data dari API
          const response = await apiClient.get("/progress/language");
          languagesData = response || [];
          console.log("Data bahasa dari API:", languagesData);
        } catch (apiError) {
          console.warn(
            "Gagal mengambil data dari API, menggunakan mock data:",
            apiError
          );
          // Gunakan mock data sebagai fallback
          languagesData = [
            {
              language_code: "BISINDO",
              language_name: "Bahasa Isyarat Indonesia",
              completed: 14,
              total: 24,
            },
            {
              language_code: "SIBI",
              language_name: "Sistem Isyarat Bahasa Indonesia",
              completed: 12,
              total: 18,
            },
            {
              language_code: "ASL",
              language_name: "American Sign Language",
              completed: 10,
              total: 16,
            },
          ];
        }

        // Set languages from data
        setLanguages(languagesData);
        setLoading(false);
        // Mark data as fetched
        setDataFetched(true);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
        console.error("Error fetching data:", err);
        // Still mark as fetched to prevent retries
        setDataFetched(true);
      }
    };

    fetchData();
  }, [dataFetched]); // Only depend on dataFetched flag

  const getProgressPercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-100">Profile</span>
        </div>

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Saya</h1>
          <p className="text-lg text-blue-200">
            Lihat progress pembelajaran bahasa isyarat Anda
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Left Section - Language Progress */}
          <div className="lg:col-span-3 bg-blue-800/30 rounded-xl p-6 border border-blue-600/50">
            <h2 className="text-xl font-semibold mb-6">Progress Bahasa</h2>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-300 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language, index) => (
                  <div
                    key={index}
                    className="bg-blue-700 rounded-lg p-4 transition-all hover:bg-blue-600"
                  >
                    <h3 className="text-lg font-bold mb-3">
                      {language.language_name}
                    </h3>
                    <p className="text-sm text-blue-200 mb-3">
                      {language.language_code}
                    </p>
                    <div className="bg-blue-600 h-2 rounded-full mb-3">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${getProgressPercentage(
                            language.completed,
                            language.total
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-blue-300 block">
                          Completed
                        </span>
                        <span className="text-lg font-bold">
                          {language.completed}/{language.total}
                        </span>
                      </div>
                      <button className="bg-black hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                        <span className="text-white text-sm">▶</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - User Profile */}
          <div className="bg-blue-800 rounded-xl p-6 border border-blue-600/50 flex flex-col">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-blue-700 overflow-hidden mb-4">
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
              <p className="text-blue-300 mb-4">@{userProfile.username}</p>

              <div className="bg-blue-700 rounded-lg p-4 w-full text-center">
                <span className="text-sm text-blue-300 block mb-1">Score</span>
                <span className="text-3xl font-bold text-yellow-400">
                  {userProfile.score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
