// This file will handle authentication with the Express backend and Supabase

// Set the API base URL - to be updated with actual backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Local storage keys
const USER_KEY = "isyara_user";
const ACCESS_TOKEN_KEY = "isyara_access_token";
const REFRESH_TOKEN_KEY = "isyara_refresh_token";

// Add this at the top of the file
const DEBUG_MODE = false;

// Import supabase
import supabase from "../supabaseClient";

// Helper to store user data and tokens in local storage
const storeUserData = (userData, tokens) => {
  // Tambahkan field name jika belum ada
  const enhancedUserData = {
    ...userData,
    name: userData.name || userData.user_metadata?.full_name || userData.email,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(enhancedUserData));

  // Debug what we're trying to store
  console.log("Storing user data:", enhancedUserData);
  console.log("Token data structure:", tokens);

  // Handle different token formats
  if (tokens) {
    // Handle Supabase session specifically
    if (tokens.supabase_session) {
      console.log("Menyimpan token Supabase dari backend");
      // Simpan token Supabase ke localStorage khusus
      localStorage.setItem(
        "supabase_access_token",
        tokens.supabase_session.access_token
      );
      localStorage.setItem(
        "supabase_refresh_token",
        tokens.supabase_session.refresh_token
      );

      // Juga update session Supabase secara langsung
      try {
        const { data, error } = supabase.auth.setSession({
          access_token: tokens.supabase_session.access_token,
          refresh_token: tokens.supabase_session.refresh_token,
        });
        if (error) {
          console.error("Error setting Supabase session:", error);
        } else {
          console.log("Supabase session set successfully");
        }
      } catch (err) {
        console.error("Error updating Supabase session:", err);
      }
    }

    // Handle regular token formats
    if (tokens.session && tokens.session.access_token) {
      console.log("Storing access token from session object");
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.session.access_token);
      if (tokens.session.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.session.refresh_token);
      }
    } else if (typeof tokens === "object") {
      if (tokens.access_token) {
        console.log("Storing access token from direct object");
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
      }
      if (tokens.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
      }
    } else if (typeof tokens === "string") {
      console.log("Storing string token");
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens);
    }
  }
};

// Helper to clear user data from local storage
const clearUserData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Get the current authenticated user from local storage
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Get the access token from local storage
const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get the refresh token from local storage
const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Register a new user with email and password
const register = async (
  username,
  email,
  password,
  requireEmailVerification = true
) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        requireEmailVerification,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Jika verifikasi email dibutuhkan, jangan simpan token
    if (!requireEmailVerification && data.user) {
      const tokens = {
        access_token: data.access_token || data.token,
        refresh_token: data.refresh_token,
      };
      storeUserData(data.user, tokens);
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Tambahkan fungsi untuk mengirim ulang email verifikasi
const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend verification email");
    }

    return data;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
};

// Tambahkan fungsi untuk verifikasi email
const verifyEmail = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email verification failed");
    }

    // Jika verifikasi berhasil dan user data ada
    if (data.user) {
      const tokens = {
        access_token: data.access_token || data.token,
        refresh_token: data.refresh_token,
      };
      storeUserData(data.user, tokens);
    }

    return data;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};

// Login with email and password
const login = async (email, password) => {
  try {
    // 1. Login ke backend
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Login gagal. Silakan coba lagi."
      );
    }

    // 2. Login ke Supabase juga untuk mendapatkan token storage
    try {
      const { data: supabaseData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error("Supabase login error:", error);
      } else {
        console.log("Supabase login berhasil:", supabaseData.user?.id);
        // Tambahkan data Supabase ke respons backend
        data.supabase = supabaseData;
      }
    } catch (supabaseError) {
      console.error("Error saat login ke Supabase:", supabaseError);
    }

    // 3. Store user data and tokens
    if (data.user) {
      storeUserData(data.user, data);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout the user
const logout = () => {
  try {
    clearUserData();
    // Tambahkan pembersihan data lain jika diperlukan
    console.log("Logout successful: localStorage cleared");
  } catch (error) {
    console.error("Error during logout:", error);
    // Fallback: coba bersihkan localStorage secara manual
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  }
};

// Save Google user data to backend
const saveGoogleUser = async (userData) => {
  try {
    if (DEBUG_MODE) {
      console.log("Saving Google user to backend:", userData.id);
    }

    // Pastikan user data memiliki field name
    const enhancedUserData = {
      ...userData,
      name:
        userData.name || userData.user_metadata?.full_name || userData.email,
      avatar_url: userData.user_metadata?.avatar_url,
    };

    // Lakukan request ke backend secara asinkron
    const response = await fetch(`${API_URL}/auth/save-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enhancedUserData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Jika error duplikat, tidak perlu melakukan apa-apa karena token sudah disimpan di AuthContext
      if (
        response.status === 500 &&
        (data.message?.includes("already exists") ||
          data.message?.includes("duplicate"))
      ) {
        if (DEBUG_MODE) {
          console.log(
            "User already exists, token already saved by AuthContext"
          );
        }
        return { user: enhancedUserData };
      }
      throw new Error(data.message || "Failed to save Google user");
    }

    // Kita tidak perlu menyimpan token di sini karena sudah disimpan di AuthContext
    return data;
  } catch (error) {
    console.error("Error saving Google user:", error);
    // Jangan throw error di sini, biarkan proses autentikasi tetap berjalan
    return { user: userData };
  }
};

// Google OAuth login
const googleLogin = () => {
  // Will be implemented to integrate with Google OAuth
  window.location.href = `${API_URL}/auth/google`;
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getAccessToken();
};

// Refresh the access token using the refresh token
const refreshToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    // Update tokens in storage
    if (data.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }

    return data;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  saveGoogleUser,
  googleLogin,
  refreshToken,
  resendVerificationEmail,
  verifyEmail,
};

export default authService;
