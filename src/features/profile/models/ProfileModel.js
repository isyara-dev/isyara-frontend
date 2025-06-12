import apiClient from "../../../services/api/apiClient";
import supabase from "../../../services/supabaseClient";

class ProfileModel {
  async fetchUserProfile() {
    try {
      const userData = await apiClient.getUserProfile();
      return {
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        password: "",
        avatar_url: userData.avatar_url || "/profile-avatar.png",
        login_method: userData.login_method || "email",
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(updateData) {
    try {
      const response = await apiClient.put("/users/me", updateData);

      // Update local storage
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("isyara_user") || "{}"
        );
        const updatedStoredUser = { ...storedUser, ...updateData };
        localStorage.setItem("isyara_user", JSON.stringify(updatedStoredUser));
      } catch (error) {
        console.error("Error updating local storage:", error);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkSupabaseAuth() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return { user, session };
      } else if (!session) {
        // Coba gunakan token tersimpan jika ada
        const accessToken = localStorage.getItem("supabase_access_token");
        const refreshToken = localStorage.getItem("supabase_refresh_token");

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error && data.session) {
            const {
              data: { user: authUser },
            } = await supabase.auth.getUser();
            if (authUser) return { user: authUser, session: data.session };
          }
        }
      }

      return { user: null, session: null };
    } catch (error) {
      console.error("Error checking Supabase auth:", error);
      return { user: null, session: null, error };
    }
  }

  async uploadImageToSupabase(file) {
    if (!file) return null;

    try {
      // Cek sesi Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Sesi Supabase tidak ditemukan");
      }

      // Gunakan format path yang benar sesuai RLS policy
      const filePath = `${user.id}/${Date.now()}-${file.name.replace(
        /\s+/g,
        "-"
      )}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileModel();
