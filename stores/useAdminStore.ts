import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";

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
  role: "user" | "health_worker";
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
  role?: "user" | "health_worker";
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: "user" | "health_worker";
}

interface UserStats {
  total: number;
  active: number;
  deactivated: number;
}

interface AdminState {
  isLoading: boolean;
  admins: Admin[];
  selectedAdmin: Admin | null;
  stats: AdminStats | null;
  users: User[];
  selectedUser: User | null;
  userStats: UserStats | null;

  // Admin Actions
  runInitialSeed: () => Promise<boolean>;
  revokeUserTokens: (userId: string, reason?: string) => Promise<boolean>;
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
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoading: false,
  admins: [],
  selectedAdmin: null,
  stats: null,
  users: [],
  selectedUser: null,
  userStats: null,

  runInitialSeed: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/seed-initial");
      toast.success(response.data.message || "Database seeded successfully!");
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to run seed";
      toast.error(message);
      set({ isLoading: false });
      return false;
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
      const message =
        error.response?.data?.error?.message || "Failed to revoke tokens";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  createAdmin: async (data: CreateAdminData) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/admins", data);
      const message = response.data.message || "Admin created successfully";
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
        const message =
          error.response?.data?.error?.message || "Failed to create admin";
        toast.error(message);
      }
      set({ isLoading: false });
      return false;
    }
  },

  listAdmins: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/admins");
      const admins = response.data.data.admins || [];
      set({ admins, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch admins";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  getAdminById: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/admins/${adminId}`);
      const admin = response.data.data.admin;
      set({ selectedAdmin: admin, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch admin details";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  updateAdmin: async (adminId: string, data: UpdateAdminData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/admin/admins/${adminId}`, data);
      const message = response.data.message || "Admin updated successfully";
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
        const message =
          error.response?.data?.error?.message || "Failed to update admin";
        toast.error(message);
      }
      set({ isLoading: false });
      return false;
    }
  },

  deactivateAdmin: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/admins/${adminId}/deactivate`);
      const message = response.data.message || "Admin deactivated successfully";
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to deactivate admin";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  activateAdmin: async (adminId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/admins/${adminId}/activate`);
      const message = response.data.message || "Admin reactivated successfully";
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to reactivate admin";
      toast.error(message);
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
      const message = response.data.message || "Password reset token generated";
      const resetToken = response.data.data.resetToken;
      toast.success(message);
      set({ isLoading: false });
      return resetToken;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        "Failed to generate reset token";
      toast.error(message);
      set({ isLoading: false });
      return null;
    }
  },

  getAdminStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/admins/stats");
      const stats = response.data.data.stats;
      set({ stats, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch admin stats";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  // User Management Methods
  listUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/users");
      const users = response.data.data.users || [];
      set({ users, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch users";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  getUserById: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/admin/users/${userId}`);
      const user = response.data.data.user;
      set({ selectedUser: user, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch user details";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  createUser: async (data: CreateUserData) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/admin/users", data);
      const message = response.data.message || "User created successfully";
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
        const message =
          error.response?.data?.error?.message || "Failed to create user";
        toast.error(message);
      }
      set({ isLoading: false });
      return false;
    }
  },

  updateUser: async (userId: string, data: UpdateUserData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/admin/users/${userId}`, data);
      const message = response.data.message || "User updated successfully";
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
        const message =
          error.response?.data?.error?.message || "Failed to update user";
        toast.error(message);
      }
      set({ isLoading: false });
      return false;
    }
  },

  deactivateUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/deactivate`);
      const message = response.data.message || "User deactivated successfully";
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to deactivate user";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  activateUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/activate`);
      const message = response.data.message || "User reactivated successfully";
      toast.success(message);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to reactivate user";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  resetUserPassword: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      const message = response.data.message || "Password reset token generated";
      const resetToken = response.data.data.resetToken;
      toast.success(message);
      set({ isLoading: false });
      return resetToken;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        "Failed to generate reset token";
      toast.error(message);
      set({ isLoading: false });
      return null;
    }
  },

  getUserStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/admin/users/stats");
      const userStats = response.data.data.stats;
      set({ userStats, isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to fetch user stats";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },
}));
