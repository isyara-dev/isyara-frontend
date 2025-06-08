import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  FaCamera,
  FaInfoCircle,
  FaLock,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import apiClient from "../../services/api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar_url: "/profile-avatar.png",
    login_method: "email",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [imgError, setImgError] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.getUserProfile();
        console.log("User profile fetched:", userData);

        setProfile({
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          password: "",
          avatar_url: userData.avatar_url || "/profile-avatar.png",
          login_method: userData.login_method || "email",
        });

        // Set preview URL for avatar
        if (userData.avatar_url) {
          setPreviewUrl(userData.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setNotification({
          show: true,
          message:
            "Gagal memuat profil: " + (error.message || "Terjadi kesalahan"),
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate placeholder avatar if image fails to load
  const getAvatarUrl = () => {
    if (imgError || !profile.avatar_url) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.name || "User"
      )}&background=4ade80&color=fff&size=200`;
    }
    return previewUrl || profile.avatar_url;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      // Prepare update data
      const updateData = {};

      // Only include fields that have changed
      if (profile.name && profile.name !== currentUser?.name) {
        updateData.name = profile.name;
      }

      if (profile.username && profile.username !== currentUser?.username) {
        updateData.username = profile.username;
      }

      // Only include password if provided and not a Google account
      if (profile.password && profile.login_method !== "google") {
        updateData.password = profile.password;
      }

      // Handle avatar upload if selected
      if (selectedImage) {
        // TODO: Implement actual image upload
        console.log("Would upload image:", selectedImage.name);
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await apiClient.put("/users/me", updateData);
        setNotification({
          show: true,
          message: "Profil berhasil diperbarui!",
          type: "success",
        });

        // If password was updated, show a message about session expiration
        if (updateData.password) {
          setNotification({
            show: true,
            message:
              "Sesi akan berakhir karena perubahan password. Silakan login kembali.",
            type: "info",
          });
          // Give time for the notification to be seen before logout
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      } else {
        setNotification({
          show: true,
          message: "Tidak ada perubahan untuk disimpan",
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        show: true,
        message:
          "Gagal memperbarui profil: " + (error.message || "Terjadi kesalahan"),
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col pb-16 md:pb-8">
        {notification.show && (
          <div
            className={`p-4 mb-6 rounded-lg flex justify-between items-center ${
              notification.type === "success"
                ? "bg-green-600/70"
                : notification.type === "error"
                ? "bg-red-600/70"
                : "bg-blue-600/70"
            }`}
          >
            <p>{notification.message}</p>
            <button onClick={closeNotification} className="text-white">
              ×
            </button>
          </div>
        )}

        <div className="flex items-center text-xs md:text-sm text-text-light/80 mb-4 md:mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-text-light">Pengaturan Profil</span>
        </div>

        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-white">
            Pengaturan Profil
          </h1>
          <p className="text-base md:text-lg text-text-light/80">
            Perbarui informasi akun Anda
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-300"></div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl">
            <div className="bg-secondary rounded-lg mb-8 p-6 md:p-8 shadow-md">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={getAvatarUrl()}
                    alt={profile.name || "User"}
                    className="rounded-full w-28 h-28 object-cover border-4 border-white shadow-lg"
                    onError={() => setImgError(true)}
                  />
                  <label className="absolute -bottom-1 -right-1 bg-accent hover:bg-accent/80 rounded-full p-2 text-white cursor-pointer shadow-md transition-all duration-300">
                    <FaCamera size={16} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="border-b border-green-700/30 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Informasi Dasar
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-green-100">
                        Nama <FaInfoCircle className="ml-1 text-green-300" />
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nama Anda"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-primary/40 text-white border border-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-green-100">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-primary/40 text-white border border-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Akun */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Informasi Akun
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-green-100">
                        <FaEnvelope className="mr-2" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        value={profile.email}
                        disabled={true}
                        className="w-full px-4 py-2 rounded-lg bg-primary/20 text-white/70 border border-green-700/30 cursor-not-allowed"
                      />
                      <p className="text-xs text-green-300 mt-1">
                        Email tidak dapat diubah saat ini
                      </p>
                    </div>

                    {profile.login_method !== "google" && (
                      <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-green-100">
                          <FaLock className="mr-2" /> Password Baru
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Masukkan password baru"
                          value={profile.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-primary/40 text-white border border-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <p className="text-xs text-yellow-300 mt-1">
                          Perubahan password akan mengakhiri sesi Anda dan
                          memerlukan login ulang
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:justify-end gap-4 pt-6">
                  <div className="md:hidden">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center bg-gradient-to-r from-red-700 to-red-500 hover:from-red-700/80 hover:to-red-500/80 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      <span>Keluar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    disabled={updating}
                  >
                    {updating ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
