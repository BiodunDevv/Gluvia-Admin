"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentUser } from "@/stores/useDashboardStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconUsers } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

interface RecentUsersTableProps {
  users: RecentUser[];
}

function formatDiabetesType(type?: string | null): string | null {
  if (!type) return null;
  const map: Record<string, string> = {
    type1: "Type 1",
    type2: "Type 2",
    prediabetes: "Pre-diabetes",
    unknown: "Unknown",
  };
  return map[type] ?? type;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Recently registered users</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <IconUsers className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No registered users yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            New users will appear here once they sign up
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          {users.length} most recent registration{users.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          {users.map((user) => {
            const diabetesLabel = formatDiabetesType(user.diabetesType);
            const avatarColor = getAvatarColor(user.name);
            const joinedAgo = formatDistanceToNow(new Date(user.createdAt), {
              addSuffix: true,
            });
            const lastSeenAgo = user.lastLoginAt
              ? formatDistanceToNow(new Date(user.lastLoginAt), {
                  addSuffix: true,
                })
              : null;

            return (
              <div
                key={user._id}
                className="flex min-w-0 items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
              >
                {/* Avatar */}
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className={`text-xs font-semibold ${avatarColor}`}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* User info — min-w-0 ensures truncation works */}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-semibold leading-none text-foreground">
                      {user.name}
                    </p>
                    {diabetesLabel && (
                      <Badge
                        variant="outline"
                        className="shrink-0 px-1.5 py-0 text-[10px]"
                      >
                        {diabetesLabel}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                    {lastSeenAgo ? `Last seen ${lastSeenAgo}` : "Never logged in"}
                  </p>
                </div>

                {/* Joined time — shrink-0 prevents squeezing */}
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <IconClock className="h-3 w-3" />
                    <span className="whitespace-nowrap">{joinedAgo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
