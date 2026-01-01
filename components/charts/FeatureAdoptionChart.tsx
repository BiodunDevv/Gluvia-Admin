"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserEngagement } from "@/stores/useDashboardStore";

interface FeatureAdoptionChartProps {
  engagement: UserEngagement | null;
}

const COLORS = {
  mealLogs: "#10b981",
  glucoseLogs: "#3b82f6",
};

export function FeatureAdoptionChart({
  engagement,
}: FeatureAdoptionChartProps) {
  if (!engagement || !engagement.featureUsage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Adoption</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="h-75 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Safe defaults for all values
  const usersWithMealLogs = engagement.featureUsage?.usersWithMealLogs ?? 0;
  const usersWithGlucoseLogs =
    engagement.featureUsage?.usersWithGlucoseLogs ?? 0;
  const totalUsers = engagement.totalUsers ?? 0;
  const activeUsersLast7Days = engagement.activeUsers?.last7Days ?? 0;
  const activeUsersLast30Days = engagement.activeUsers?.last30Days ?? 0;
  const engagementRate7Days = parseFloat(
    engagement.activeUsers?.engagementRate7Days ?? "0"
  );
  const engagementRate30Days = parseFloat(
    engagement.activeUsers?.engagementRate30Days ?? "0"
  );
  const avgMealLogsPerUser = engagement.averages?.mealLogsPerUser ?? 0;
  const avgGlucoseLogsPerUser = engagement.averages?.glucoseLogsPerUser ?? 0;

  const data = [
    {
      name: "Meal Logs Users",
      value: usersWithMealLogs,
      color: COLORS.mealLogs,
    },
    {
      name: "Glucose Logs Users",
      value: usersWithGlucoseLogs,
      color: COLORS.glucoseLogs,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Adoption</CardTitle>
        <CardDescription>User engagement by feature</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                `${entry.name}: ${entry.value.toLocaleString()}`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active (7 Days)</p>
            <p className="text-2xl font-bold">
              {activeUsersLast7Days.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {engagementRate7Days.toFixed(1)}% engagement
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active (30 Days)</p>
            <p className="text-2xl font-bold">
              {activeUsersLast30Days.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {engagementRate30Days.toFixed(1)}% engagement
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Logs/User</p>
            <p className="text-2xl font-bold">
              {avgMealLogsPerUser.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">
              {avgGlucoseLogsPerUser.toFixed(1)} glucose
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
