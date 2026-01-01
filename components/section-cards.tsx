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
  const usersNewThisMonth = users.newThisMonth ?? 0;
  const usersGrowth = users.growth ?? 0;

  const foodsTotal = foods.total ?? 0;
  const foodsValidated = foods.validated ?? 0;
  const foodsManual = foods.manual ?? 0;
  const foodsEstimated = foods.estimated ?? 0;

  const totalMealLogs = activity.totalMealLogs ?? 0;
  const totalGlucoseLogs = activity.totalGlucoseLogs ?? 0;
  const avgMealsPerUser = activity.avgMealsPerUser ?? 0;
  const avgGlucosePerUser = activity.avgGlucosePerUser ?? 0;

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
              {usersGrowth >= 0 ? (
                <>
                  <IconTrendingUp />+{usersGrowth}%
                </>
              ) : (
                <>
                  <IconTrendingDown />
                  {usersGrowth}%
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {usersActive} active users{" "}
            {usersGrowth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {usersNewThisMonth} new this month
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
              {foodsValidated} verified
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {foodsManual} manual entries <IconChartLine className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {foodsEstimated} estimated values
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
            {avgMealsPerUser.toFixed(1)} avg per user{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Strong engagement</div>
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
            {avgGlucosePerUser.toFixed(1)} avg per user{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Health monitoring</div>
        </CardFooter>
      </Card>
    </div>
  );
}
