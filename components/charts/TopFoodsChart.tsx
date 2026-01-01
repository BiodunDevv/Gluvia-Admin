"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopFood } from "@/stores/useDashboardStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconTrophy } from "@tabler/icons-react";

interface TopFoodsChartProps {
  data: TopFood[];
  limit?: number;
}

export function TopFoodsChart({ data, limit = 10 }: TopFoodsChartProps) {
  const chartData = data.slice(0, limit).map((food, index) => ({
    ...food,
    rank: index + 1,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconTrophy className="h-5 w-5 text-amber-500" />
          <div>
            <CardTitle>Top Foods</CardTitle>
            <CardDescription>Most frequently logged by users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top 3 with Images */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b">
            {chartData.slice(0, 3).map((food) => (
              <div key={food._id} className="text-center space-y-2">
                <div className="relative inline-block">
                  <Avatar className="h-16 w-16 mx-auto border-2 border-amber-400">
                    <AvatarImage src={food.category || ""} alt={food.name} />
                    <AvatarFallback className="text-xs">
                      {food.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {food.rank}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm truncate">{food.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {food.usageCount.toLocaleString()} logs
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                className="text-xs"
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value} logs`, "Usage"]}
              />
              <Bar
                dataKey="usageCount"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
