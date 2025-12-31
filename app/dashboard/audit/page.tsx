"use client";

import { useEffect, useState } from "react";
import { useAuditStore } from "@/stores/useAuditStore";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { AuditDataTable } from "@/components/audit-data-table";

export default function AuditLogsPage() {
  const { logs, pagination, isLoading, fetchAuditLogs } = useAuditStore();
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    fetchAuditLogs({ page: 1, limit: 50 });
  }, [fetchAuditLogs]);

  const handleFilterChange = (action: string) => {
    setActionFilter(action);
    fetchAuditLogs({
      action: action === "all" ? undefined : action,
      page: 1,
      limit: 50,
    });
  };

  const handlePageChange = (newPage: number) => {
    fetchAuditLogs({
      action: actionFilter === "all" ? undefined : actionFilter,
      page: newPage,
      limit: 50,
    });
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all administrative actions and system events
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchAuditLogs({ page: 1, limit: 50 })}
          disabled={isLoading}
        >
          <IconRefresh className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <AuditDataTable
        data={logs}
        isLoading={isLoading}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        actionFilter={actionFilter}
        onActionFilterChange={handleFilterChange}
      />
    </div>
  );
}
