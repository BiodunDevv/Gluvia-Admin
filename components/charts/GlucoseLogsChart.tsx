"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartDataPoint } from "@/stores/useDashboardStore";

interface GlucoseLogsChartProps {
  data: ChartDataPoint[];
}

export function GlucoseLogsChart({ data }: GlucoseLogsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Glucose Monitoring</CardTitle>
        <CardDescription>
          Daily glucose log counts and average readings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Log Count"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="average"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Avg Glucose (mg/dL)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
