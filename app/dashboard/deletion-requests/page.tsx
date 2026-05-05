"use client";

import * as React from "react";
import {
  AccountDeletionRequest,
  AccountDeletionStatus,
  useAdminStore,
} from "@/stores/useAdminStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconCalendarDue, IconLoader2, IconRefresh, IconTrash, IconX } from "@tabler/icons-react";

const statusOptions: Array<AccountDeletionStatus | "all"> = [
  "all",
  "verification_sent",
  "pending_admin_review",
  "approved_scheduled",
  "completed",
  "cancelled",
  "expired",
];

const statusLabel: Record<AccountDeletionStatus | "all", string> = {
  all: "All requests",
  verification_sent: "Verification sent",
  pending_admin_review: "Pending review",
  approved_scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

const formatDate = (value?: string) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const userLabel = (request: AccountDeletionRequest) => {
  if (!request.userId || typeof request.userId === "string") return "Unlinked";
  return request.userId.name || request.userId.email;
};

export default function DeletionRequestsPage() {
  const {
    accountDeletionRequests,
    selectedAccountDeletionRequest,
    isLoading,
    listAccountDeletionRequests,
    getAccountDeletionRequest,
    approveAccountDeletionRequest,
    cancelAccountDeletionRequest,
  } = useAdminStore();
  const [status, setStatus] = React.useState<AccountDeletionStatus | "all">("all");
  const [selected, setSelected] = React.useState<AccountDeletionRequest | null>(null);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [schedule, setSchedule] = React.useState<"immediate" | "15_days" | "30_days">("15_days");
  const [adminNotes, setAdminNotes] = React.useState("");
  const [cancelReason, setCancelReason] = React.useState("");

  React.useEffect(() => {
    listAccountDeletionRequests(status);
  }, [status, listAccountDeletionRequests]);

  const openDetails = async (request: AccountDeletionRequest) => {
    setSelected(request);
    await getAccountDeletionRequest(request._id);
  };

  const activeRequest = selectedAccountDeletionRequest || selected;
  const canReview =
    activeRequest?.status === "pending_admin_review" ||
    activeRequest?.status === "approved_scheduled";

  const submitApproval = async () => {
    if (!activeRequest) return;
    const ok = await approveAccountDeletionRequest(
      activeRequest._id,
      schedule,
      adminNotes
    );
    if (ok) {
      setApproveOpen(false);
      setAdminNotes("");
      await listAccountDeletionRequests(status);
      await getAccountDeletionRequest(activeRequest._id);
    }
  };

  const submitCancel = async () => {
    if (!activeRequest) return;
    const ok = await cancelAccountDeletionRequest(
      activeRequest._id,
      cancelReason || "Cancelled by admin"
    );
    if (ok) {
      setCancelOpen(false);
      setCancelReason("");
      await listAccountDeletionRequests(status);
      await getAccountDeletionRequest(activeRequest._id);
    }
  };

  const counts = accountDeletionRequests.reduce(
    (acc, request) => {
      acc.total += 1;
      if (request.status === "pending_admin_review") acc.pending += 1;
      if (request.status === "approved_scheduled") acc.scheduled += 1;
      return acc;
    },
    { total: 0, pending: 0, scheduled: 0 }
  );

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Account Deletion Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Review Google Play account deletion requests and schedule removals.
          </p>
        </div>
        <Button variant="outline" onClick={() => listAccountDeletionRequests(status)}>
          {isLoading ? (
            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IconRefresh className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.scheduled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Requests</CardTitle>
              <CardDescription>
                Select a request to review status and approve deletion.
              </CardDescription>
            </div>
            <Select value={status} onValueChange={(value) => setStatus(value as AccountDeletionStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {statusLabel[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountDeletionRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div className="font-medium">{request.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {userLabel(request)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{statusLabel[request.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.requestedAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {request.scheduleOption
                          ? `${request.scheduleOption.replace("_", " ")} · ${formatDate(request.scheduledDeletionAt)}`
                          : "Not approved"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetails(request)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!accountDeletionRequests.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-28 text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading requests..." : "No deletion requests found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request details</CardTitle>
            <CardDescription>
              Review the selected request before taking action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!activeRequest ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                Select a request from the table.
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="font-medium">{activeRequest.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {statusLabel[activeRequest.status]}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Requested: {formatDate(activeRequest.requestedAt)}</p>
                  <p>Verified: {formatDate(activeRequest.verifiedAt)}</p>
                  <p>Scheduled: {formatDate(activeRequest.scheduledDeletionAt)}</p>
                  <p>Completed: {formatDate(activeRequest.completedAt)}</p>
                </div>
                {activeRequest.cancellationReason && (
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                    {activeRequest.cancellationReason}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button disabled={!canReview || isLoading} onClick={() => setApproveOpen(true)}>
                    <IconCalendarDue className="mr-2 h-4 w-4" />
                    Approve deletion
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!canReview || isLoading}
                    onClick={() => setCancelOpen(true)}
                  >
                    <IconX className="mr-2 h-4 w-4" />
                    Cancel request
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve account deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Choose when this user account and associated data should be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Deletion schedule</Label>
              <Select value={schedule} onValueChange={(value) => setSchedule(value as typeof schedule)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Delete immediately</SelectItem>
                  <SelectItem value="15_days">Delete in 15 days</SelectItem>
                  <SelectItem value="30_days">Delete in 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin notes</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                placeholder="Optional internal note"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitApproval}>
              <IconTrash className="mr-2 h-4 w-4" />
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel deletion request</AlertDialogTitle>
            <AlertDialogDescription>
              The user will receive an email explaining that the request was cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Reason</Label>
            <Textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Cancelled by admin"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={submitCancel}>Cancel request</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
