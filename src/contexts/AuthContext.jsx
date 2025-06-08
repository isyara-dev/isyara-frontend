import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import authService from "../services/auth/authService";
import supabase from "../services/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Gunakan ref untuk mencegah multiple logout calls dan infinite loop
  const isLoggingOut = useRef(false);
  const ignoreAuthChange = useRef(false);

  // Fungsi untuk menyimpan data sesi
  const saveSessionData = useCallback((session) => {
    if (!session) return;

    try {
      // Tambahkan informasi nama dari metadata ke data user
      const enhancedUserData = {
        ...session.user,
        name: session.user.user_metadata?.full_name || session.user.email,
      };

      // Simpan token dan data user yang sudah ditambahkan name
      localStorage.setItem("isyara_access_token", session.access_token);
      localStorage.setItem("isyara_user", JSON.stringify(enhancedUserData));

      // Update state dengan data user yang sudah ditambahkan name
      setCurrentUser(enhancedUserData);
      setIsAuthenticated(true);

      // Sinkronisasi ke backend sebagai proses terpisah (non-blocking)
      // Kirim data user yang sudah ditambahkan name
      authService.saveGoogleUser(enhancedUserData).catch((err) => {
        console.error("Backend sync failed:", err);
      });
    } catch (error) {
      console.error("Error saving session data:", error);
    }
  }, []);

  // Fungsi logout kita definisikan di sini dengan useCallback
  const logout = useCallback(async () => {
    // Mencegah multiple logout calls
    if (isLoggingOut.current) return;

    try {
      isLoggingOut.current = true;
      ignoreAuthChange.current = true;

      // Bersihkan localStorage terlebih dahulu
      authService.logout();

      // Lalu update state
      setCurrentUser(null);
      setIsAuthenticated(false);

      // Terakhir, panggil signOut dari Supabase
      await supabase.auth.signOut();

      // Reset flag setelah logout selesai
      setTimeout(() => {
        ignoreAuthChange.current = false;
        isLoggingOut.current = false;
      }, 1000);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");

      // Reset flag meskipun error
      ignoreAuthChange.current = false;
      isLoggingOut.current = false;
    }
  }, []);

  // Ini adalah SATU-SATUNYA useEffect yang kita butuhkan untuk menangani sesi
  useEffect(() => {
    // 1. Cek sesi yang sudah ada saat aplikasi pertama kali dimuat
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Gunakan fungsi saveSessionData untuk konsistensi
          saveSessionData(session);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false); // Selesai loading awal
      }
    };

    checkExistingSession();

    // 2. Listener untuk perubahan state berikutnya (login, logout, refresh token)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Jika sedang dalam proses logout, abaikan event state change
        if (ignoreAuthChange.current) return;

        if (event === "SIGNED_IN" && session) {
          // Gunakan fungsi saveSessionData untuk konsistensi
          saveSessionData(session);
        } else if (event === "SIGNED_OUT") {
          // Jangan panggil fungsi logout lagi untuk mencegah infinite loop
          // Cukup bersihkan state dan localStorage
          if (!isLoggingOut.current) {
            authService.logout();
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } else if (event === "TOKEN_REFRESHED" && session) {
          // Jika token di-refresh oleh Supabase, update di localStorage
          localStorage.setItem("isyara_access_token", session.access_token);
        }
      }
    );

    // 3. Cleanup listener saat komponen unmount
    return () => {
      // Periksa apakah listener ada dan memiliki method unsubscribe
      if (listener && typeof listener.unsubscribe === "function") {
        try {
          listener.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth listener:", error);
        }
      }
    };
  }, [logout, saveSessionData]);

  // Login dengan email dan password
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(email, password);
      // onAuthStateChange akan menangani sisanya, tapi kita bisa set state di sini untuk responsivitas
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await authService.register(username, email, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // --- Value yang diberikan ke seluruh aplikasi ---
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
