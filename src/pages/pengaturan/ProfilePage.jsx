import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { FaCamera, FaInfoCircle, FaLock, FaEnvelope } from "react-icons/fa";
import apiClient from "../../services/api/apiClient";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar_url: "/profile-avatar.png",
    login_method: "email",
    score: 0,
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
          score: userData.score || 0,
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
        // In a real implementation, you would upload the image to a server
        // and get back a URL. For now, we'll just simulate this.
        // updateData.avatar_url = "https://example.com/avatar.png";

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

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10">
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

        <div className="text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="text-blue-100 font-medium">Profile</span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Profile</h1>
          <p className="text-lg text-blue-200">Perbarui informasi akun anda</p>
        </header>

        {loading ? (
          <div className="text-center py-10">
            <p>Memuat data profil...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* form */}
            <div className="lg:w-2/3 bg-blue-800/40 rounded-2xl p-8 shadow-xl border border-blue-700">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={
                      previewUrl || profile.avatar_url || "/profile-avatar.png"
                    }
                    alt={profile.name || "User"}
                    className="rounded-full w-28 h-28 object-cover border-4 border-white"
                  />
                  <label className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-2 text-white cursor-pointer">
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
                <div className="border-b border-blue-700 pb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Informasi Dasar
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        Nama <FaInfoCircle className="ml-1 text-blue-300" />
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nama Anda"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Akun */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-4">Informasi Akun</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <FaEnvelope className="mr-2" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        value={profile.email}
                        disabled={true}
                        className="w-full px-4 py-2 rounded-lg bg-blue-700/50 text-white/70 border border-blue-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-blue-300 mt-1">
                        Email tidak dapat diubah saat ini
                      </p>
                    </div>

                    {profile.login_method !== "google" && (
                      <div>
                        <label className="flex items-center text-sm font-medium mb-2">
                          <FaLock className="mr-2" /> Password Baru
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Masukkan password baru"
                          value={profile.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <p className="text-xs text-yellow-300 mt-1">
                          Perubahan password akan mengakhiri sesi Anda dan
                          memerlukan login ulang
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-6">
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full font-semibold"
                  >
                    Hapus Akun
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-full font-semibold"
                    disabled={updating}
                  >
                    {updating ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>

            {/* profile card */}
            <div className="lg:w-1/3 bg-blue-800/50 rounded-2xl p-6 text-center shadow-xl border border-blue-700">
              <img
                src={previewUrl || profile.avatar_url || "/profile-avatar.png"}
                alt={profile.name || "User"}
                className="mx-auto rounded-full border-4 border-yellow-400 w-24 h-24 object-cover mb-4"
              />
              <h3 className="text-xl font-bold">{profile.name || "User"}</h3>
              <p className="text-sm text-blue-200">
                @{profile.username || "username"}
              </p>
              <p className="text-yellow-400 text-lg mt-2 font-semibold">
                Score: {profile.score || 0}
              </p>

              <div className="mt-4 bg-blue-700/50 p-2 rounded-lg">
                <p className="text-xs text-blue-200">
                  Login dengan{" "}
                  {profile.login_method === "google" ? "Google" : "Email"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
