import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";
import {
  getErrorMessage,
  getNestedValue,
  getResponseData,
  getResponseMessage,
} from "@/lib/api-helpers";

export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: "admin";
  phone?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateAdminData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface UpdateAdminData {
  name?: string;
  email?: string;
  phone?: string;
}

interface AdminStats {
  total: number;
  active: number;
  deactivated: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user";
  phone?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: "user";
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: "user";
}

interface UserStats {
  total: number;
  active: number;
  deactivated: number;
}

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}

interface AppSettings {
  supportPhone: string;
  googleFormLink: string;
}

export interface SeedRequest {
  targets: Array<"foods" | "rules" | "config" | "users">;
  destructive?: boolean;
  includeImages?: boolean;
}

export interface SeedPreview {
  defaults: {
    targets: Array<"foods" | "rules" | "config">;
    mode: "additive";
    imageSource: string;
  };
  availableTargets: Array<{
    id: "foods" | "rules" | "config" | "users";
    label: string;
    description: string;
    plannedItems: number;
    currentItems: number;
    files: Array<{
      key: string;
      label: string;
      items: number;
    }>;
  }>;
}

export interface SeedResult {
  targets: string[];
  mode: "additive" | "destructive";
  results: Array<{
    target: string;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    imageSearch?: {
      enabled: boolean;
      source: string;
      updated: number;
      skipped: number;
      errors: number;
    };
  }>;
  errors: Array<{
    target: string;
    message: string;
  }>;
  success: boolean;
}

interface AdminState {
  isLoading: boolean;
  isSearchingUsers: boolean;
  admins: Admin[];
  selectedAdmin: Admin | null;
  stats: AdminStats | null;
  users: User[];
  selectedUser: User | null;
  userStats: UserStats | null;
  maintenance: MaintenanceSettings | null;
  appSettings: AppSettings | null;
  userSearchResults: User[];
  lastSeedResult: SeedResult | null;
  seedPreview: SeedPreview | null;

  // Admin Actions
  runInitialSeed: () => Promise<boolean>;
  runSeed: (data: SeedRequest) => Promise<SeedResult | null>;
  getSeedPreview: () => Promise<SeedPreview | null>;
  revokeUserTokens: (userId: string, reason?: string) => Promise<boolean>;
  searchUsers: (query: string) => Promise<User[]>;
  createAdmin: (data: CreateAdminData) => Promise<boolean>;
  listAdmins: () => Promise<boolean>;
  getAdminById: (adminId: string) => Promise<boolean>;
  updateAdmin: (adminId: string, data: UpdateAdminData) => Promise<boolean>;
  deactivateAdmin: (adminId: string) => Promise<boolean>;
  activateAdmin: (adminId: string) => Promise<boolean>;
  resetAdminPassword: (adminId: string) => Promise<string | null>;
  getAdminStats: () => Promise<boolean>;

  // User Management Actions
  listUsers: () => Promise<boolean>;
  getUserById: (userId: string) => Promise<boolean>;
  createUser: (data: CreateUserData) => Promise<boolean>;
  updateUser: (userId: string, data: UpdateUserData) => Promise<boolean>;
  deactivateUser: (userId: string) => Promise<boolean>;
  activateUser: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<string | null>;
  getUserStats: () => Promise<boolean>;
  getMaintenanceMode: () => Promise<boolean>;
  setMaintenanceMode: (
    enabled: boolean,
    message?: string
  ) => Promise<boolean>;
  getAppSettings: () => Promise<boolean>;
  setAppSettings: (
    supportPhone: string,
    googleFormLink: string
  ) => Promise<boolean>;
  broadcastNotification: (title: string, body: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoading: false,
  isSearchingUsers: false,
  admins: [],
  selectedAdmin: null,
  stats: null,
  users: [],
  selectedUser: null,
  userStats: null,
  maintenance: null,
  appSettings: null,
  userSearchResults: [],
  lastSeedResult: null,
  seedPreview: null,

  runInitialSeed: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/seed-initial");
      toast.success(getResponseMessage(response, "Database seeded successfully!"));
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to run seed"));
      set({ isLoading: false });
      return false;
    }
  },

  runSeed: async (data: SeedRequest) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/seed", data);
      const payload = getResponseData<SeedResult | null>(response);
      const result = payload;
      set({ isLoading: false, lastSeedResult: result });
      toast.success(getResponseMessage(response, "Seed completed"));
      return result;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to run seed job"));
      set({ isLoading: false });
      return null;
    }
  },

  getSeedPreview: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/seed/preview");
      const payload = getResponseData<SeedPreview | null>(response);
      set({ isLoading: false, seedPreview: payload });
      return payload;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to load seed preview"));
      set({ isLoading: false });
      return null;
    }
  },

  revokeUserTokens: async (userId: string, reason = "Admin action") => {
    set({ isLoading: true });
    try {
      await api.post("/admin/revoke-user-tokens", { userId, reason });
      toast.success("User tokens revoked successfully!");
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to revoke tokens"));
      set({ isLoading: false });
      return false;
    }
  },

  searchUsers: async (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      set({ userSearchResults: [], isSearchingUsers: false });
      return [];
    }

    set({ isSearchingUsers: true });
    try {
      const response = await api.get("/admin/users/search", {
        params: { q: trimmed, limit: 8 },
      });
      const users = getResponseData<User[]>(response) || [];
      set({ userSearchResults: users, isSearchingUsers: false });
      return users;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to search users"));
      set({ userSearchResults: [], isSearchingUsers: false });
      return [];
    }
  },

  createAdmin: async (data: CreateAdminData) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/admins", data);
      const message = getResponseMessage(response, "Admin created successfully");
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        details.forEach((detail: { field: string; message: string }) => {
          toast.error(`${detail.field}: ${detail.message}`);
        });
      } else {
        toast.error(getErrorMessage(error, "Failed to create admin"));
      }
      set({ isLoading: false });
      return false;
    }
  },

  listAdmins: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/admins");
      const payload = getResponseData<any>(response);
      const admins = getNestedValue<Admin[]>(payload, ["admins", "items"], []);
      set({ admins, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch admins"));
      set({ isLoading: false });
      return false;
    }
  },

  getAdminById: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/admins/${adminId}`);
      const payload = getResponseData<any>(response);
      const admin = getNestedValue<Admin | null>(payload, ["admin"], payload);
      set({ selectedAdmin: admin, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch admin details"));
      set({ isLoading: false });
      return false;
    }
  },

  updateAdmin: async (adminId: string, data: UpdateAdminData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/admin/admins/${adminId}`, data);
      const message = getResponseMessage(response, "Admin updated successfully");
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        details.forEach((detail: { field: string; message: string }) => {
          toast.error(`${detail.field}: ${detail.message}`);
        });
      } else {
        toast.error(getErrorMessage(error, "Failed to update admin"));
      }
      set({ isLoading: false });
      return false;
    }
  },

  deactivateAdmin: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/admins/${adminId}/deactivate`);
      const message = getResponseMessage(
        response,
        "Admin deactivated successfully"
      );
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to deactivate admin"));
      set({ isLoading: false });
      return false;
    }
  },

  activateAdmin: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/admins/${adminId}/activate`);
      const message = getResponseMessage(
        response,
        "Admin reactivated successfully"
      );
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to reactivate admin"));
      set({ isLoading: false });
      return false;
    }
  },

  resetAdminPassword: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        `/admin/admins/${adminId}/reset-password`
      );
      const payload = getResponseData<any>(response);
      const message = getResponseMessage(
        response,
        "Password reset token generated"
      );
      const resetToken = getNestedValue<string | null>(
        payload,
        ["resetToken"],
        null
      );
      toast.success(message);
      set({ isLoading: false });
      return resetToken;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to generate reset token"));
      set({ isLoading: false });
      return null;
    }
  },

  getAdminStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/admins/stats");
      const payload = getResponseData<any>(response);
      const stats = getNestedValue<AdminStats | null>(payload, ["stats"], payload);
      set({ stats, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch admin stats"));
      set({ isLoading: false });
      return false;
    }
  },

  // User Management Methods
  listUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/users");
      const payload = getResponseData<any>(response);
      const users = getNestedValue<User[]>(payload, ["users", "items"], []);
      set({ users, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch users"));
      set({ isLoading: false });
      return false;
    }
  },

  getUserById: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/users/${userId}`);
      const payload = getResponseData<any>(response);
      const user = getNestedValue<User | null>(payload, ["user"], payload);
      set({ selectedUser: user, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch user details"));
      set({ isLoading: false });
      return false;
    }
  },

  createUser: async (data: CreateUserData) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/users", data);
      const message = getResponseMessage(response, "User created successfully");
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        details.forEach((detail: { field: string; message: string }) => {
          toast.error(`${detail.field}: ${detail.message}`);
        });
      } else {
        toast.error(getErrorMessage(error, "Failed to create user"));
      }
      set({ isLoading: false });
      return false;
    }
  },

  updateUser: async (userId: string, data: UpdateUserData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/admin/users/${userId}`, data);
      const message = getResponseMessage(response, "User updated successfully");
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        details.forEach((detail: { field: string; message: string }) => {
          toast.error(`${detail.field}: ${detail.message}`);
        });
      } else {
        toast.error(getErrorMessage(error, "Failed to update user"));
      }
      set({ isLoading: false });
      return false;
    }
  },

  deactivateUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/deactivate`);
      const message = getResponseMessage(
        response,
        "User deactivated successfully"
      );
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to deactivate user"));
      set({ isLoading: false });
      return false;
    }
  },

  activateUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/activate`);
      const message = getResponseMessage(
        response,
        "User reactivated successfully"
      );
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to reactivate user"));
      set({ isLoading: false });
      return false;
    }
  },

  resetUserPassword: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      const payload = getResponseData<any>(response);
      const message = getResponseMessage(
        response,
        "Password reset token generated"
      );
      const resetToken = getNestedValue<string | null>(
        payload,
        ["resetToken"],
        null
      );
      toast.success(message);
      set({ isLoading: false });
      return resetToken;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to generate reset token"));
      set({ isLoading: false });
      return null;
    }
  },

  getUserStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/users/stats");
      const payload = getResponseData<any>(response);
      const userStats = getNestedValue<UserStats | null>(
        payload,
        ["stats"],
        payload
      );
      set({ userStats, isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch user stats"));
      set({ isLoading: false });
      return false;
    }
  },

  getMaintenanceMode: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/maintenance-mode");
      set({
        maintenance: getResponseData<MaintenanceSettings | null>(response),
        isLoading: false,
      });
      return true;
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Failed to fetch maintenance mode")
      );
      set({ isLoading: false });
      return false;
    }
  },

  setMaintenanceMode: async (enabled: boolean, message?: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/maintenance-mode", {
        enabled,
        message,
      });
      set({
        maintenance: getResponseData<MaintenanceSettings | null>(response),
        isLoading: false,
      });
      toast.success(getResponseMessage(response, "Maintenance mode updated"));
      return true;
    } catch (error: any) {
      toast.error(
        getErrorMessage(error, "Failed to update maintenance mode")
      );
      set({ isLoading: false });
      return false;
    }
  },

  getAppSettings: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/app-settings");
      set({
        appSettings: getResponseData<AppSettings | null>(response),
        isLoading: false,
      });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch app settings"));
      set({ isLoading: false });
      return false;
    }
  },

  setAppSettings: async (supportPhone: string, googleFormLink: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/app-settings", {
        supportPhone,
        googleFormLink,
      });
      set({
        appSettings: getResponseData<AppSettings | null>(response),
        isLoading: false,
      });
      toast.success(getResponseMessage(response, "App settings updated"));
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to update app settings"));
      set({ isLoading: false });
      return false;
    }
  },

  broadcastNotification: async (title: string, body: string) => {
    set({ isLoading: true });
    try {
      await api.post("/admin/notifications/broadcast", { title, body });
      toast.success("Notification sent successfully");
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to send notification"));
      set({ isLoading: false });
      return false;
    }
  },
}));
