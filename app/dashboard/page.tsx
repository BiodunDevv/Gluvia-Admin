"use client";

import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";

import data from "./data.json";

export default function Page() {
  const {
    overview,
    userGrowthChart,
    isLoadingOverview,
    isLoadingCharts,
    getDashboardOverview,
    getUserGrowthChart,
    getMealLogsChart,
    getGlucoseLogsChart,
    getTopFoods,
    refreshAll,
  } = useDashboardStore();

  useEffect(() => {
    // Fetch initial dashboard data
    getDashboardOverview();
    getUserGrowthChart(30);
    getMealLogsChart(30);
    getGlucoseLogsChart(30);
    getTopFoods(20);
  }, [
    getDashboardOverview,
    getUserGrowthChart,
    getMealLogsChart,
    getGlucoseLogsChart,
    getTopFoods,
  ]);

  return (
    <>
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

      <div className="px-4 lg:px-6">
        {isLoadingCharts ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ChartAreaInteractive chartData={userGrowthChart} />
        )}
      </div>
    </>
  );
}
