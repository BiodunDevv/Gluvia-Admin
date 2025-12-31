import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";

// Types
export interface Food {
  _id: string;
  localName: string;
  canonicalName?: string;
  category?: string;
  nutrients: {
    calories: number;
    carbs_g: number;
    protein_g: number;
    fat_g: number;
    fibre_g: number;
    gi: number | null;
  };
  portionSizes: Array<{
    name: string;
    grams: number;
    carbs_g?: number;
  }>;
  affordability?: "low" | "medium" | "high";
  tags?: string[];
  imageUrl?: string;
  regionVariants?: Array<{
    region: string;
    note: string;
  }>;
  source?: "manual" | "validated" | "estimated";
  version: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FoodPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FoodFilters {
  search?: string;
  tags?: string;
  maxGI?: number;
  category?: string;
  affordability?: string;
  page?: number;
  limit?: number;
}

interface ImageSearchResult {
  foodName: string;
  searchQuery: string;
  imageUrl: string;
  source: "curated" | "google" | "unsplash" | "placeholder" | "none";
  usedAI: boolean;
}

interface FoodState {
  foods: Food[];
  currentFood: Food | null;
  pagination: FoodPagination | null;
  isLoading: boolean;

  // Actions
  fetchFoods: (filters?: FoodFilters) => Promise<void>;
  getFoodById: (id: string) => Promise<Food | null>;
  createFood: (data: Partial<Food>) => Promise<boolean>;
  updateFood: (id: string, data: Partial<Food>) => Promise<boolean>;
  deleteFood: (id: string) => Promise<boolean>;
  batchUploadFoods: (
    foods: Partial<Food>[]
  ) => Promise<
    | boolean
    | { successCount: number; skippedCount?: number; totalCount: number }
  >;
  searchFoodImage: (
    foodName: string,
    useAI?: boolean
  ) => Promise<ImageSearchResult | null>;
  setCurrentFood: (food: Food | null) => void;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  currentFood: null,
  pagination: null,
  isLoading: false,

  fetchFoods: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });

      const response = await api.get(`/foods?${params}`);

      set({
        foods: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      toast.error("Failed to fetch foods");
      set({ isLoading: false });
    }
  },

  getFoodById: async (id: string) => {
    try {
      const response = await api.get(`/foods/${id}`);
      const food = response.data.data;
      set({ currentFood: food });
      return food;
    } catch (error: any) {
      toast.error("Failed to fetch food details");
      return null;
    }
  },

  createFood: async (data: Partial<Food>) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/foods", data);
      toast.success("Food created successfully!");

      // Refresh the list
      await get().fetchFoods();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to create food";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  updateFood: async (id: string, data: Partial<Food>) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/foods/${id}`, data);
      toast.success("Food updated successfully!");

      // Refresh the list
      await get().fetchFoods();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to update food";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  deleteFood: async (id: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`/foods/${id}`);
      toast.success("Food deleted successfully!");

      // Refresh the list
      await get().fetchFoods();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to delete food";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  batchUploadFoods: async (foods: Partial<Food>[]) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/foods/batch", { foods });

      const stats = response.data.stats;

      // Check if there are any errors
      if (stats.results && stats.results.length > 0) {
        const errors = stats.results.filter((r: any) => !r.success);

        if (errors.length > 0) {
          // Show first few errors
          errors.slice(0, 3).forEach((err: any) => {
            toast.error(`Item ${err.index + 1}: ${err.error}`);
          });

          if (errors.length > 3) {
            toast.error(`...and ${errors.length - 3} more errors`);
          }
        }
      }

      if (stats.successCount > 0) {
        let message = `Batch upload complete! Success: ${stats.successCount}/${stats.totalCount}`;
        if (stats.skippedCount && stats.skippedCount > 0) {
          message += ` (Skipped: ${stats.skippedCount} - already exist)`;
        }
        toast.success(message);
      } else {
        toast.error("Batch upload failed. Please check the errors above.");
      }

      // Refresh the list if any items were uploaded
      if (stats.successCount > 0) {
        await get().fetchFoods();
      }

      set({ isLoading: false });
      return stats.successCount > 0 ? stats : false;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to upload foods";
      toast.error(message);
      set({ isLoading: false });
      return false;
    }
  },

  searchFoodImage: async (foodName: string, useAI = true) => {
    try {
      const response = await api.post("/foods/search-image", {
        foodName,
        useAI,
      });

      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to search for image";
      toast.error(message);
      return null;
    }
  },

  setCurrentFood: (food: Food | null) => {
    set({ currentFood: food });
  },
}));
