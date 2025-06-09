import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  FaCamera,
  FaInfoCircle,
  FaLock,
  FaEnvelope,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfilePresenter from "../../presenters/ProfilePresenter";
import NotificationService from "../../services/NotificationService";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [presenter] = useState(
    () =>
      new ProfilePresenter({
        setLoading,
        setProfile,
        setPreviewUrl,
        setSupabaseUser,
        setUpdating,
        setUploadingImage,
        setSelectedImage,
        updateProfile: (updates) =>
          setProfile((prev) => ({ ...prev, ...updates })),
        showNotification: (message, type, duration) =>
          NotificationService.show(message, type, duration),
        closeNotification: () => {},
      })
  );

  // Initialize
  useEffect(() => {
    presenter.initialize();
  }, [presenter]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      presenter.handleImageChange(e.target.files[0]);
    }
  };

  // Generate placeholder avatar
  const getAvatarUrl = () => {
    if (imgError || !previewUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.name || "U"
      )}&background=4ade80&color=fff&size=200`;
    }
    return previewUrl;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    presenter.handleSubmit(profile, selectedImage, currentUser);
  };

  // Handle logout confirmation
  const confirmLogout = () => {
    setShowLogoutConfirm(true);
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
                  <div className="absolute -bottom-1 -right-1">
                    <label className="bg-accent hover:bg-accent/80 rounded-full p-2 text-white cursor-pointer shadow-md transition-all duration-300 flex items-center justify-center">
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
                {uploadingImage && (
                  <div className="flex items-center mt-3 text-green-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-300 mr-2"></div>
                    <p className="text-sm">Mengunggah foto...</p>
                  </div>
                )}
                {selectedImage && !uploadingImage && (
                  <p className="text-sm text-green-300 font-medium mt-2">
                    Foto baru dipilih. Klik Simpan untuk mengonfirmasi.
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="border-b border-green-700/30 pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                    <FaInfoCircle className="mr-2 text-text-light" />
                    Informasi Dasar
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-green-100">
                        Nama
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nama Anda"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-primary/40 text-white border border-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
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
                        disabled={true}
                        className="w-full px-4 py-2 rounded-lg bg-primary/20 text-white/70 border border-green-700/30 cursor-not-allowed"
                      />
                      <p className="text-xs text-purple mt-1 font-medium flex items-center">
                        <FaInfoCircle className="mr-1" /> Username tidak dapat
                        diubah saat ini
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informasi Akun */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                    <FaLock className="mr-2 text-text-light" />
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
                      <p className="text-xs text-purple mt-1 font-medium flex items-center">
                        <FaInfoCircle className="mr-1" /> Email tidak dapat
                        diubah saat ini
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
                          className="w-full px-4 py-2 rounded-lg bg-primary/40 text-white border border-green-700/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                        />
                        <p className="text-xs text-yellow-600 mt-1 font-medium flex items-center">
                          <FaInfoCircle className="mr-1" />
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
                      type="button"
                      onClick={confirmLogout}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-700/80 hover:to-red-500/80 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    >
                      <FaSignOutAlt />
                      <span>Keluar</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center gap-2"
                    disabled={updating || uploadingImage}
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Konfirmasi Logout */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary rounded-lg p-6 max-w-sm w-full notification-fade-in">
              <h3 className="text-xl font-bold text-white mb-4">
                Konfirmasi Keluar
              </h3>
              <p className="text-text-light mb-6">
                Apakah Anda yakin ingin keluar dari akun Anda?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
