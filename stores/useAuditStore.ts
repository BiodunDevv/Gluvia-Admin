import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";

// Types
export interface AuditLog {
  _id: string;
  action: string;
  who: {
    _id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  target?: {
    collection: string;
    id: string;
  };
  payload?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AuditPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AuditFilters {
  action?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

interface AuditState {
  logs: AuditLog[];
  pagination: AuditPagination | null;
  isLoading: boolean;

  // Actions
  fetchAuditLogs: (filters?: AuditFilters) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  pagination: null,
  isLoading: false,

  fetchAuditLogs: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });

      const response = await api.get(`/admin/audit?${params}`);

      set({
        logs: response.data.data || [],
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      toast.error("Failed to fetch audit logs");
      set({ isLoading: false });
    }
  },
}));
