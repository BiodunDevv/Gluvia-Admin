import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";

// Types
interface RuleTemplate {
  _id: string;
  slug: string;
  title: string;
  type:
    | "constraint"
    | "scoring"
    | "substitution"
    | "portion_adjustment"
    | "alert";
  definition: Record<string, any>;
  nlTemplate?: string;
  appliesTo?: string[];
  deleted: boolean;
  version: number;
  createdBy?: string;
  __v?: number;
  createdAt: string;
  updatedAt: string;
}

interface RuleState {
  rules: RuleTemplate[];
  currentRule: RuleTemplate | null;
  isLoading: boolean;

  // Actions
  fetchRules: () => Promise<void>;
  getRuleBySlug: (slug: string) => Promise<RuleTemplate | null>;
  createRule: (data: Partial<RuleTemplate>) => Promise<boolean>;
  updateRule: (slug: string, data: Partial<RuleTemplate>) => Promise<boolean>;
  deleteRule: (slug: string) => Promise<boolean>;
  setCurrentRule: (rule: RuleTemplate | null) => void;
}

export const useRuleStore = create<RuleState>((set, get) => ({
  rules: [],
  currentRule: null,
  isLoading: false,

  fetchRules: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/rules");
      const rulesData =
        response.data.data?.rules ||
        response.data.rules ||
        response.data.data ||
        [];
      set({
        rules: Array.isArray(rulesData) ? rulesData : [],
        isLoading: false,
      });
    } catch (error: any) {
      toast.error("Failed to fetch rules");
      set({ isLoading: false, rules: [] });
    }
  },

  getRuleBySlug: async (slug: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/rules/${slug}`);
      const rule = response.data.data;
      set({ currentRule: rule, isLoading: false });
      return rule;
    } catch (error: any) {
      toast.error("Failed to fetch rule details");
      set({ isLoading: false });
      return null;
    }
  },

  createRule: async (data: Partial<RuleTemplate>) => {
    set({ isLoading: true });
    try {
      await api.post("/rules", data);
      toast.success("Rule created successfully!");
      await get().fetchRules();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to create rule";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  updateRule: async (slug: string, data: Partial<RuleTemplate>) => {
    set({ isLoading: true });
    try {
      await api.put(`/rules/${slug}`, data);
      toast.success("Rule updated successfully!");
      await get().fetchRules();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to update rule";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  deleteRule: async (slug: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`/rules/${slug}`);
      toast.success("Rule deleted successfully!");
      await get().fetchRules();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to delete rule";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  setCurrentRule: (rule: RuleTemplate | null) => {
    set({ currentRule: rule });
  },
}));
