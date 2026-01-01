"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentUser } from "@/stores/useDashboardStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconMail } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

interface RecentUsersTableProps {
  users: RecentUser[];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Recently registered users</CardDescription>
        </CardHeader>
        <CardContent className="h-50 flex items-center justify-center">
          <p className="text-muted-foreground">No recent users</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          {users.length} most recent registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    {user.isActive && (
                      <Badge variant="default" className="text-xs px-1.5 py-0">
                        Active
                      </Badge>
                    )}
                    {user.diabetesType && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        Type {user.diabetesType}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <IconMail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <IconClock className="h-3 w-3" />
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
