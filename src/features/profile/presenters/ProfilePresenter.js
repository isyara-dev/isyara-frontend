import ProfileModel from "../models/ProfileModel";
import NotificationService from "../../../services/NotificationService";

class ProfilePresenter {
  constructor(view) {
    this.view = view;
    this.model = ProfileModel;
  }

  async initialize() {
    try {
      this.view.setLoading(true);

      // Periksa autentikasi Supabase
      const { user: supabaseUser } = await this.model.checkSupabaseAuth();
      this.view.setSupabaseUser(supabaseUser);

      // Ambil data profil
      const profileData = await this.model.fetchUserProfile();
      this.view.setProfile(profileData);

      if (profileData.avatar_url) {
        this.view.setPreviewUrl(profileData.avatar_url);
      }
    } catch (error) {
      NotificationService.show(
        "Gagal memuat profil: " + (error.message || "Terjadi kesalahan"),
        "error"
      );
    } finally {
      this.view.setLoading(false);
    }
  }

  handleImageChange(file) {
    if (!file) return;

    // Validasi ukuran file (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      NotificationService.show(
        "Ukuran file terlalu besar (maksimal 2MB)",
        "error"
      );
      return;
    }

    this.view.setSelectedImage(file);

    // Buat preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      this.view.setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Gunakan kategori "profile-update" untuk mengelompokkan notifikasi terkait profil
    NotificationService.show(
      "Foto dipilih. Klik Simpan Perubahan untuk mengunggah.",
      "info",
      3000,
      "profile-update"
    );
  }

  async handleSubmit(profile, selectedImage, currentUser) {
    try {
      this.view.setUpdating(true);

      const updateData = {};
      let hasChanges = false;

      // 1. Proses unggah gambar jika ada gambar baru yang dipilih
      if (selectedImage) {
        try {
          // Gunakan kategori untuk menghindari notifikasi bertumpuk
          NotificationService.show(
            "Mengunggah foto profil...",
            "info",
            0, // Durasi 0 berarti tidak akan otomatis hilang
            "profile-upload"
          );
          this.view.setUploadingImage(true);

          const avatarUrl = await this.model.uploadImageToSupabase(
            selectedImage
          );
          if (avatarUrl) {
            updateData.avatar_url = avatarUrl;
            hasChanges = true;

            // Sembunyikan notifikasi upload
            NotificationService.show(
              "Foto profil berhasil diunggah",
              "success",
              3000,
              "profile-upload"
            );
          }
        } catch (error) {
          NotificationService.show(
            "Gagal mengunggah foto: " + (error.message || "Terjadi kesalahan"),
            "error",
            5000,
            "profile-upload" // Gunakan kategori yang sama untuk menggantikan notifikasi sebelumnya
          );
          this.view.setUpdating(false);
          this.view.setUploadingImage(false);
          return;
        } finally {
          this.view.setUploadingImage(false);
        }
      }

      // 2. Tambahkan data profil lain jika ada perubahan
      if (profile.name && profile.name !== currentUser?.name) {
        updateData.name = profile.name;
        hasChanges = true;
      }

      if (profile.username && profile.username !== currentUser?.username) {
        updateData.username = profile.username;
        hasChanges = true;
      }

      if (profile.password && profile.login_method !== "google") {
        updateData.password = profile.password;
        hasChanges = true;
      }

      // 3. Kirim data ke API jika ada sesuatu yang diupdate
      if (hasChanges) {
        await this.model.updateProfile(updateData);

        // Jika password diupdate, tampilkan pesan login ulang
        if (updateData.password) {
          NotificationService.show(
            "Password berhasil diubah. Anda akan dialihkan ke halaman login dalam beberapa detik.",
            "success",
            5000,
            "profile-update"
          );
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          NotificationService.show(
            "Profil berhasil diperbarui!",
            "success",
            5000,
            "profile-update"
          );
        }

        // Reset state password
        this.view.updateProfile({ password: "" });
      } else {
        NotificationService.show(
          "Tidak ada perubahan untuk disimpan",
          "info",
          3000,
          "profile-update"
        );
      }
    } catch (error) {
      NotificationService.show(
        "Gagal memperbarui profil: " + (error.message || "Terjadi kesalahan"),
        "error",
        5000,
        "profile-update"
      );
    } finally {
      this.view.setUpdating(false);
      this.view.setSelectedImage(null);
    }
  }
}

export default ProfilePresenter;
