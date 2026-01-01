"use client";

import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { MealLogsChart } from "@/components/charts/MealLogsChart";
import { GlucoseLogsChart } from "@/components/charts/GlucoseLogsChart";
import { TopFoodsChart } from "@/components/charts/TopFoodsChart";
import { FeatureAdoptionChart } from "@/components/charts/FeatureAdoptionChart";
import { SystemHealthBadge } from "@/components/dashboard/SystemHealthBadge";
import { RecentUsersTable } from "@/components/dashboard/RecentUsersTable";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";

export default function Page() {
  const {
    overview,
    userGrowthChart,
    mealLogsChart,
    glucoseLogsChart,
    topFoods,
    systemHealth,
    userEngagement,
    recentUsers,
    isLoadingOverview,
    isLoadingCharts,
    isLoadingTopFoods,
    isLoadingHealth,
    isLoadingEngagement,
    isLoadingRecentUsers,
    getDashboardOverview,
    getUserGrowthChart,
    getMealLogsChart,
    getGlucoseLogsChart,
    getTopFoods,
    getSystemHealth,
    getUserEngagement,
    getRecentUsers,
    refreshAll,
  } = useDashboardStore();

  useEffect(() => {
    // Fetch initial dashboard data
    getDashboardOverview();
    getUserGrowthChart(30);
    getMealLogsChart(30);
    getGlucoseLogsChart(30);
    getTopFoods(20);
    getSystemHealth();
    getUserEngagement();
    getRecentUsers(10);
  }, [
    getDashboardOverview,
    getUserGrowthChart,
    getMealLogsChart,
    getGlucoseLogsChart,
    getTopFoods,
    getSystemHealth,
    getUserEngagement,
    getRecentUsers,
  ]);

  const handleRefresh = async () => {
    toast.info("Refreshing dashboard data...");
    await refreshAll();
    toast.success("Dashboard refreshed!");
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time system metrics and analytics
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <IconRefresh className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats Cards */}
      {isLoadingOverview ? (
        <div className="space-y-4 px-4 lg:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <SectionCards overview={overview} />
      )}

      {/* System Health */}
      <div className="px-4 lg:px-6">
        {isLoadingHealth ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <SystemHealthBadge health={systemHealth} />
        )}
      </div>

      {/* Charts Grid - Row 1: User Growth & Meal Logs */}
      <div className="px-4 lg:px-6 grid gap-6 lg:grid-cols-2">
        {isLoadingCharts ? (
          <>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : (
          <>
            <ChartAreaInteractive chartData={userGrowthChart} />
            <MealLogsChart data={mealLogsChart} />
          </>
        )}
      </div>

      {/* Charts Grid - Row 2: Glucose Logs & Top Foods */}
      <div className="px-4 lg:px-6 grid gap-6 lg:grid-cols-2">
        {isLoadingCharts || isLoadingTopFoods ? (
          <>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : (
          <>
            <GlucoseLogsChart data={glucoseLogsChart} />
            <TopFoodsChart data={topFoods} limit={10} />
          </>
        )}
      </div>

      {/* Charts Grid - Row 3: Feature Adoption & Recent Users */}
      <div className="px-4 lg:px-6 grid gap-6 lg:grid-cols-2">
        {isLoadingEngagement || isLoadingRecentUsers ? (
          <>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : (
          <>
            <FeatureAdoptionChart engagement={userEngagement} />
            <RecentUsersTable users={recentUsers} />
          </>
        )}
      </div>
    </div>
  );
}
