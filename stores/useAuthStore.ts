import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import {
  getErrorMessage,
  getResponseData,
  getResponseMessage,
} from "@/lib/api-helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
interface AdminUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "admin";
  phone?: string;
  age?: number;
  diabetesType?: "type1" | "type2" | "gestational" | "prediabetes";
  deleted: boolean;
  profile?: {
    allergies: string[];
  };
  consent?: {
    accepted: boolean;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  isLoggingOut: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getMe: () => Promise<boolean>;
  updateMe: (data: Partial<AdminUser>) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<boolean>;
  setUser: (user: AdminUser | null) => void;
}

// Axios instance with interceptor
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const state = useAuthStore.getState();
      // Only logout if not already logging out and user is authenticated
      if (!state.isLoggingOut && state.isAuthenticated) {
        state.logout();
        toast.error("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      isLoggingOut: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          const payload = getResponseData<any>(response) || {};
          const { user, token } = payload;
          const message = getResponseMessage(response, "Login successful");

          // Verify user is admin
          if (user.role !== "admin") {
            toast.error("Access denied. Admin privileges required.");
            set({ isLoading: false });
            return false;
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(message);
          return true;
        } catch (error: any) {
          toast.error(getErrorMessage(error, "Login failed"));
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        // Prevent multiple logout calls
        if (get().isLoggingOut) return;

        set({ isLoggingOut: true });

        try {
          const response = await api.post("/auth/logout");
          const message = getResponseMessage(response, "Logged out successfully");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoggingOut: false,
          });

          toast.success(message);
        } catch (error: any) {
          console.error("Logout error:", error);
          // Clear local state even if API call fails
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoggingOut: false,
          });
          toast.success("Logged out successfully");
        }
      },

      getMe: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        set({ isLoading: true });
        try {
          const response = await api.get("/auth/me");
          const payload = getResponseData<any>(response) || {};
          const { user } = payload;

          // Verify user is admin
          if (user.role !== "admin") {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return false;
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          console.error("Auth check failed:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      updateMe: async (data: Partial<AdminUser>) => {
        set({ isLoading: true });
        try {
          const response = await api.put("/auth/me", data);
          const payload = getResponseData<any>(response) || {};
          const { user } = payload;
          const message = getResponseMessage(
            response,
            "Profile updated successfully"
          );

          set({
            user,
            isLoading: false,
          });

          toast.success(message);
          return true;
        } catch (error: any) {
          toast.error(getErrorMessage(error, "Failed to update profile"));
          set({ isLoading: false });
          return false;
        }
      },

      requestPasswordReset: async (email: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(
            `${API_URL}/auth/password-reset-request`,
            { email }
          );
          const message = getResponseMessage(
            response,
            "If the email exists, a password reset link has been sent"
          );

          toast.success(message);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          toast.error(getErrorMessage(error, "Failed to send reset email"));
          set({ isLoading: false });
          return false;
        }
      },

      resetPassword: async (resetToken: string, newPassword: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/password-reset`, {
            resetToken,
            newPassword,
          });
          const message = getResponseMessage(
            response,
            "Password reset successful"
          );

          toast.success(message);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          // Handle validation errors with details
          if (error.response?.data?.error?.details) {
            const details = error.response.data.error.details;
            details.forEach((detail: { field: string; message: string }) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(
              getErrorMessage(
                error,
                "Failed to reset password. Token may be invalid or expired."
              )
            );
          }
          set({ isLoading: false });
          return false;
        }
      },

      setUser: (user: AdminUser | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

// Export API instance for use in other stores
export { api };
