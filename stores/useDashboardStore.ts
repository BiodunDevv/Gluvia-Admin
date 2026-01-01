import { create } from "zustand";
import { api } from "./useAuthStore";
import { toast } from "sonner";

// Types
export interface DashboardOverview {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  foods: {
    total: number;
    manual: number;
    validated: number;
    estimated: number;
  };
  activity: {
    totalMealLogs: number;
    totalGlucoseLogs: number;
    avgMealsPerUser: number;
    avgGlucosePerUser: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export interface ChartDataPoint {
  date: string;
  count: number;
  average?: number;
}

export interface TopFood {
  _id: string;
  name: string;
  usageCount: number;
  category?: string;
  gi?: number;
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  database: {
    status: string;
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
}

export interface UserEngagement {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number;
  featureUsage: {
    mealLogs: number;
    glucoseLogs: number;
    foodSearch: number;
    recommendations: number;
  };
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  diabetesType?: string;
  isActive: boolean;
}

export interface ActivityHeatmap {
  day: string;
  hour: number;
  activity: number;
}

interface DashboardState {
  // Data
  overview: DashboardOverview | null;
  userGrowthChart: ChartDataPoint[];
  mealLogsChart: ChartDataPoint[];
  glucoseLogsChart: ChartDataPoint[];
  topFoods: TopFood[];
  systemHealth: SystemHealth | null;
  userEngagement: UserEngagement | null;
  recentUsers: RecentUser[];
  activityHeatmap: ActivityHeatmap[];

  // Loading states
  isLoadingOverview: boolean;
  isLoadingCharts: boolean;
  isLoadingTopFoods: boolean;
  isLoadingHealth: boolean;
  isLoadingEngagement: boolean;
  isLoadingRecentUsers: boolean;
  isLoadingHeatmap: boolean;

  // Actions
  getDashboardOverview: () => Promise<void>;
  getUserGrowthChart: (days?: number) => Promise<void>;
  getMealLogsChart: (days?: number) => Promise<void>;
  getGlucoseLogsChart: (days?: number) => Promise<void>;
  getTopFoods: (limit?: number) => Promise<void>;
  getSystemHealth: () => Promise<void>;
  getUserEngagement: () => Promise<void>;
  getRecentUsers: (limit?: number) => Promise<void>;
  getActivityHeatmap: (days?: number) => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state
  overview: null,
  userGrowthChart: [],
  mealLogsChart: [],
  glucoseLogsChart: [],
  topFoods: [],
  systemHealth: null,
  userEngagement: null,
  recentUsers: [],
  activityHeatmap: [],

  isLoadingOverview: false,
  isLoadingCharts: false,
  isLoadingTopFoods: false,
  isLoadingHealth: false,
  isLoadingEngagement: false,
  isLoadingRecentUsers: false,
  isLoadingHeatmap: false,

  // Actions
  getDashboardOverview: async () => {
    set({ isLoadingOverview: true });
    try {
      const response = await api.get("/admin/dashboard/overview");
      set({ overview: response.data.data, isLoadingOverview: false });
    } catch (error: any) {
      console.error("Failed to fetch dashboard overview:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard overview"
      );
      set({ isLoadingOverview: false });
    }
  },

  getUserGrowthChart: async (days = 30) => {
    set({ isLoadingCharts: true });
    try {
      const response = await api.get(
        `/admin/dashboard/charts/user-growth?days=${days}`
      );
      set({ userGrowthChart: response.data.data, isLoadingCharts: false });
    } catch (error: any) {
      console.error("Failed to fetch user growth chart:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch user growth chart"
      );
      set({ isLoadingCharts: false });
    }
  },

  getMealLogsChart: async (days = 30) => {
    set({ isLoadingCharts: true });
    try {
      const response = await api.get(
        `/admin/dashboard/charts/meal-logs?days=${days}`
      );
      set({ mealLogsChart: response.data.data, isLoadingCharts: false });
    } catch (error: any) {
      console.error("Failed to fetch meal logs chart:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch meal logs chart"
      );
      set({ isLoadingCharts: false });
    }
  },

  getGlucoseLogsChart: async (days = 30) => {
    set({ isLoadingCharts: true });
    try {
      const response = await api.get(
        `/admin/dashboard/charts/glucose-logs?days=${days}`
      );
      set({ glucoseLogsChart: response.data.data, isLoadingCharts: false });
    } catch (error: any) {
      console.error("Failed to fetch glucose logs chart:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch glucose logs chart"
      );
      set({ isLoadingCharts: false });
    }
  },

  getTopFoods: async (limit = 20) => {
    set({ isLoadingTopFoods: true });
    try {
      const response = await api.get(
        `/admin/dashboard/top-foods?limit=${limit}`
      );
      set({ topFoods: response.data.data, isLoadingTopFoods: false });
    } catch (error: any) {
      console.error("Failed to fetch top foods:", error);
      toast.error(error.response?.data?.message || "Failed to fetch top foods");
      set({ isLoadingTopFoods: false });
    }
  },

  getSystemHealth: async () => {
    set({ isLoadingHealth: true });
    try {
      const response = await api.get("/admin/dashboard/system-health");
      set({ systemHealth: response.data.data, isLoadingHealth: false });
    } catch (error: any) {
      console.error("Failed to fetch system health:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch system health"
      );
      set({ isLoadingHealth: false });
    }
  },

  getUserEngagement: async () => {
    set({ isLoadingEngagement: true });
    try {
      const response = await api.get("/admin/dashboard/user-engagement");
      set({ userEngagement: response.data.data, isLoadingEngagement: false });
    } catch (error: any) {
      console.error("Failed to fetch user engagement:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch user engagement"
      );
      set({ isLoadingEngagement: false });
    }
  },

  getRecentUsers: async (limit = 10) => {
    set({ isLoadingRecentUsers: true });
    try {
      const response = await api.get(
        `/admin/dashboard/recent-users?limit=${limit}`
      );
      set({ recentUsers: response.data.data, isLoadingRecentUsers: false });
    } catch (error: any) {
      console.error("Failed to fetch recent users:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch recent users"
      );
      set({ isLoadingRecentUsers: false });
    }
  },

  getActivityHeatmap: async (days = 7) => {
    set({ isLoadingHeatmap: true });
    try {
      const response = await api.get(
        `/admin/dashboard/activity-heatmap?days=${days}`
      );
      set({ activityHeatmap: response.data.data, isLoadingHeatmap: false });
    } catch (error: any) {
      console.error("Failed to fetch activity heatmap:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch activity heatmap"
      );
      set({ isLoadingHeatmap: false });
    }
  },

  refreshAll: async () => {
    const store = useDashboardStore.getState();
    await Promise.all([
      store.getDashboardOverview(),
      store.getUserGrowthChart(),
      store.getMealLogsChart(),
      store.getGlucoseLogsChart(),
      store.getTopFoods(),
      store.getSystemHealth(),
      store.getUserEngagement(),
      store.getRecentUsers(),
      store.getActivityHeatmap(),
    ]);
    toast.success("Dashboard data refreshed");
  },
}));
