import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import apiClient from "../../services/api/apiClient";
import Sidebar from "../../components/layout/Sidebar";
import { Lock, Award } from "lucide-react"; // Menggunakan Award sebagai ikon piala yang lebih baik

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
  const [imgError, setImgError] = useState(false);

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
              completed: 0,
              total: 0,
            },
            {
              language_code: "ASL",
              language_name: "American Sign Language",
              completed: 0,
              total: 0,
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

  const handleLanguageClick = (languageCode) => {
    if (languageCode === "BISINDO") {
      navigate("/belajar");
    }
  };

  // Check if language is coming soon based on total modules
  const isComingSoon = (language) => {
    return language.total === 0;
  };

  // Generate placeholder avatar if image fails to load
  const getAvatarUrl = () => {
    if (imgError || !userProfile.avatarUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userProfile.name
      )}&background=4ade80&color=fff&size=200`;
    }
    return userProfile.avatarUrl;
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-background via-primary to-background text-white justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col pb-16 md:pb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-xs md:text-sm text-green-200 mb-4 md:mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-green-100">Profile</span>
        </div>

        {/* Page Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-white">
            Profile Saya
          </h1>
          <p className="text-base md:text-lg text-green-200">
            Lihat progress pembelajaran bahasa isyarat Anda
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 flex-grow lg:items-start">
          {/* Profile Section - Ditampilkan di atas untuk mobile */}
          <div className="lg:col-span-1 lg:order-2 order-1">
            {/* Mobile Profile View */}
            <div className="flex md:hidden items-center bg-secondary rounded-lg p-4 shadow-md">
              <div className="w-16 h-16 rounded-full bg-green-700 overflow-hidden mr-4 border-4 border-white shadow-lg">
                <img
                  src={getAvatarUrl()}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white">
                  {userProfile.name}
                </h2>
                <p className="text-green-300 text-sm mb-1">
                  @{userProfile.username}
                </p>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-lg font-bold text-yellow-400">
                    {userProfile.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Profile View with Podium Style */}
            <div className="hidden md:block relative mt-19">
              {/* Avatar that overlaps with card */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 z-10">
                <div className="w-32 h-32 rounded-full bg-green-700 overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={getAvatarUrl()}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-secondary rounded-lg shadow-md pt-20 pb-6 px-6">
                {/* User Info */}
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {userProfile.name}
                  </h2>
                  <p className="text-green-300 text-sm mb-3">
                    @{userProfile.username}
                  </p>

                  {/* Score with Award Icon */}
                  <div className="flex items-center justify-center bg-accent rounded-full px-4 py-2">
                    <Award className="w-6 h-6 text-yellow-400 mr-2" />
                    <span className="text-2xl font-bold text-yellow-400">
                      {userProfile.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Progress Section */}
          <div className="lg:col-span-3 lg:order-1 order-2 rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white">
              Progress Bahasa
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-300"></div>
              </div>
            ) : error ? (
              <div className="text-red-300 text-center py-4">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {languages.map((language, index) => {
                  const comingSoon = isComingSoon(language);
                  return (
                    <div
                      key={index}
                      className={`rounded-lg p-3 md:p-4 shadow-md bg-secondary relative overflow-hidden ${
                        !comingSoon &&
                        "hover:bg-secondary/60 hover:translate-y-[-2px] cursor-pointer"
                      } transition-all duration-300 hover:shadow-lg`}
                      onClick={() =>
                        !comingSoon &&
                        handleLanguageClick(language.language_code)
                      }
                    >
                      <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-center text-white">
                        {language.language_name}
                      </h3>
                      <p className="text-xs md:text-sm text-green-200 mb-2 md:mb-3 text-center tracking-wider">
                        {language.language_code}
                      </p>

                      {comingSoon ? (
                        <>
                          {/* Konten asli yang digelapkan */}
                          <div className="opacity-30">
                            <div className="bg-green-900/20 h-1.5 md:h-2 rounded-full mb-2 md:mb-3">
                              <div
                                className="bg-gradient-to-r from-green-500 to-cyan-500 h-1.5 md:h-2 rounded-full"
                                style={{ width: "30%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs text-green-300 block">
                                  Terselesaikan
                                </span>
                                <span className="text-base md:text-lg font-bold text-white">
                                  0/0
                                </span>
                              </div>
                              <button className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                                <span className="text-white text-xs md:text-sm">
                                  ▶
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Overlay dengan gembok dan teks */}
                          <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center">
                            <Lock className="w-12 h-12 text-white mb-3" />
                            <span className="text-white font-semibold text-base md:text-lg">
                              Segera Hadir
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-green-900/20 h-1.5 md:h-2 rounded-full mb-2 md:mb-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-cyan-500 h-1.5 md:h-2 rounded-full transition-all duration-500"
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
                              <span className="text-xs text-green-300 block">
                                Terselesaikan
                              </span>
                              <span className="text-base md:text-lg font-bold text-white">
                                {language.completed}/{language.total}
                              </span>
                            </div>
                            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                              <span className="text-white text-xs md:text-sm">
                                ▶
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
