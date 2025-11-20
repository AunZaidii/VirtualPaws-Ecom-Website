// API Client utility for Netlify Functions
// This replaces direct Supabase calls in the frontend

class ApiClient {
  constructor() {
    this.baseUrl = "/.netlify/functions";
  }

  // Get auth token from localStorage (set by auth functions)
  getAuthToken() {
    const session = localStorage.getItem("supabase.auth.session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.access_token;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Set auth session in localStorage
  setAuthSession(session) {
    if (session) {
      localStorage.setItem("supabase.auth.session", JSON.stringify(session));
    } else {
      localStorage.removeItem("supabase.auth.session");
    }
  }

  // Get user from session
  getUser() {
    const session = localStorage.getItem("supabase.auth.session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.user;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

