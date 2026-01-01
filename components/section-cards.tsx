import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconApple,
  IconActivity,
  IconChartLine,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardOverview } from "@/stores/useDashboardStore";

interface SectionCardsProps {
  overview: DashboardOverview | null;
}

export function SectionCards({ overview }: SectionCardsProps) {
  if (!overview || !overview.users || !overview.foods || !overview.activity) {
    return null;
  }

  const { users, foods, activity } = overview;

  // Safe defaults for all numeric values
  const usersTotal = users.total ?? 0;
  const usersActive = users.active ?? 0;
  const usersNewLast30Days = users.newLast30Days ?? 0;
  const usersNewLast7Days = users.newLast7Days ?? 0;
  const usersGrowthRate = parseFloat(users.growthRate ?? "0");

  const foodsTotal = foods.total ?? 0;
  const foodsNewLast30Days = foods.newLast30Days ?? 0;

  const totalMealLogs = activity.mealLogs.total ?? 0;
  const mealLogsLast24h = activity.mealLogs.last24h ?? 0;
  const mealLogsLast7Days = activity.mealLogs.last7Days ?? 0;

  const totalGlucoseLogs = activity.glucoseLogs.total ?? 0;
  const glucoseLogsLast24h = activity.glucoseLogs.last24h ?? 0;
  const glucoseLogsLast7Days = activity.glucoseLogs.last7Days ?? 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            Total Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usersTotal.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {usersGrowthRate >= 0 ? (
                <>
                  <IconTrendingUp />+{usersGrowthRate.toFixed(1)}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {usersGrowthRate.toFixed(1)}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {usersActive.toLocaleString()} active users{" "}
            {usersGrowthRate >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            +{usersNewLast7Days} this week • +{usersNewLast30Days} this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconApple className="h-4 w-4" />
            Food Database
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {foodsTotal.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              +{foodsNewLast30Days} new
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {foods.byCategory?.length ?? 0} categories{" "}
            <IconChartLine className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {foodsNewLast30Days} added this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconActivity className="h-4 w-4" />
            Meal Logs
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalMealLogs.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {mealLogsLast24h.toLocaleString()} in last 24h{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {mealLogsLast7Days.toLocaleString()} in last 7 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconChartLine className="h-4 w-4" />
            Glucose Logs
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalGlucoseLogs.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Tracking
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {glucoseLogsLast24h.toLocaleString()} in last 24h{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {glucoseLogsLast7Days.toLocaleString()} in last 7 days
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
