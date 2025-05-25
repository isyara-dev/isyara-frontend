import authService from "../auth/authService";

const API_URL =
  import.meta.env.VITE_API_URL || "https://isyara-dev.up.railway.app/api";

// Create a fetch wrapper with interceptor functionality
const apiClient = {
  // Add authorization header to request
  addAuthHeader(headers = {}) {
    const token = authService.getAccessToken();
    if (token) {
      return {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return headers;
  },

  // Handle API responses
  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 Unauthorized - attempt to refresh token
      if (response.status === 401) {
        try {
          // Try to refresh the token
          const refreshResult = await this.refreshToken();

          if (refreshResult.success) {
            // Retry the original request with new token
            const originalRequest = response.request;
            if (originalRequest) {
              return this.fetch(originalRequest.url, {
                method: originalRequest.method,
                headers: this.addAuthHeader(originalRequest.headers),
                body: originalRequest.body,
              });
            }
          }
        } catch (refreshError) {
          // If refresh fails, logout
          authService.logout();
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
      }

      // For other errors, throw with message from server or default
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  },

  // Refresh token method
  async refreshToken() {
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      return { success: false };
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to refresh token");
      }

      // Update tokens in storage
      if (data.access_token) {
        localStorage.setItem("isyara_access_token", data.access_token);
      }

      if (data.refresh_token) {
        localStorage.setItem("isyara_refresh_token", data.refresh_token);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, error };
    }
  },

  // Main fetch wrapper method
  async fetch(endpoint, options = {}) {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_URL}${endpoint}`;

    // Add default headers and auth header
    const headers = this.addAuthHeader({
      "Content-Type": "application/json",
      ...options.headers,
    });

    // Store original request for potential retry after token refresh
    const request = {
      url,
      method: options.method || "GET",
      headers,
      body: options.body,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Attach original request to response for potential retry
      response.request = request;

      return this.handleResponse(response);
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Convenience methods for different HTTP methods
  get(endpoint, options = {}) {
    return this.fetch(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, data, options = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.fetch(endpoint, { ...options, method: "DELETE" });
  },

  // Helper method to get user profile
  getUserProfile() {
    return this.get("/auth/me");
  },
};

export default apiClient;
