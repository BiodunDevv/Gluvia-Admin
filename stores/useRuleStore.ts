import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";
import {
  getErrorMessage,
  getNestedValue,
  getResponseData,
} from "@/lib/api-helpers";

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
      const payload = getResponseData<any>(response);
      const rulesData = Array.isArray(payload)
        ? payload
        : getNestedValue<RuleTemplate[]>(payload, ["rules", "items"], []);
      set({
        rules: Array.isArray(rulesData) ? rulesData : [],
        isLoading: false,
      });
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch rules"));
      set({ isLoading: false, rules: [] });
    }
  },

  getRuleBySlug: async (slug: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/rules/${slug}`);
      const payload = getResponseData<any>(response);
      const rule = getNestedValue<RuleTemplate | null>(payload, ["rule"], payload);
      set({ currentRule: rule, isLoading: false });
      return rule;
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to fetch rule details"));
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
      toast.error(getErrorMessage(error, "Failed to create rule"));
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
      toast.error(getErrorMessage(error, "Failed to update rule"));
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
      toast.error(getErrorMessage(error, "Failed to delete rule"));
      set({ isLoading: false });
      return false;
    }
  },

  setCurrentRule: (rule: RuleTemplate | null) => {
    set({ currentRule: rule });
  },
}));
