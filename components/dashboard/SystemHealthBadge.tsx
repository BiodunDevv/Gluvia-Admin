"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SystemHealth } from "@/stores/useDashboardStore";
import { Badge } from "@/components/ui/badge";
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconActivity,
  IconLogin,
  IconShieldX,
  IconUsers,
} from "@tabler/icons-react";

interface SystemHealthBadgeProps {
  health: SystemHealth | null;
}

export function SystemHealthBadge({ health }: SystemHealthBadgeProps) {
  if (!health || !health.status || !health.metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="h-50 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    healthy: {
      icon: IconCircleCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      badgeVariant: "default" as const,
      label: "Healthy",
    },
    warning: {
      icon: IconAlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      badgeVariant: "secondary" as const,
      label: "Warning",
    },
    critical: {
      icon: IconAlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      badgeVariant: "destructive" as const,
      label: "Critical",
    },
  };

  const config = statusConfig[health.status] || statusConfig.warning;
  const StatusIcon = config.icon;

  const recentErrors = health.metrics?.recentErrors ?? 0;
  const recentLogins = health.metrics?.recentLogins ?? 0;
  const failedLogins = health.metrics?.failedLogins ?? 0;
  const activeUsersLastHour = health.metrics?.activeUsersLastHour ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconActivity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Real-time system status</CardDescription>
          </div>
          <Badge variant={config.badgeVariant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Recent Logins */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLogin className="h-4 w-4" />
              <span className="text-xs font-medium">Recent Logins</span>
            </div>
            <p className="text-2xl font-bold">{recentLogins}</p>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </div>

          {/* Active Users */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconUsers className="h-4 w-4" />
              <span className="text-xs font-medium">Active Users</span>
            </div>
            <p className="text-2xl font-bold">{activeUsersLastHour}</p>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </div>

          {/* Failed Logins */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconShieldX className="h-4 w-4" />
              <span className="text-xs font-medium">Failed Logins</span>
            </div>
            <p
              className={`text-2xl font-bold ${
                failedLogins > 0 ? "text-red-500" : ""
              }`}
            >
              {failedLogins}
            </p>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </div>

          {/* Recent Errors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconAlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Recent Errors</span>
            </div>
            <p
              className={`text-2xl font-bold ${
                recentErrors > 0 ? "text-orange-500" : ""
              }`}
            >
              {recentErrors}
            </p>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
