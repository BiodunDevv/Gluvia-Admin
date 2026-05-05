"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage, getResponseData } from "@/lib/api-helpers";
import { IconArrowLeft, IconCheck, IconLoader2, IconTrash, IconX } from "@tabler/icons-react";

type RequestStatus =
  | "verification_sent"
  | "pending_admin_review"
  | "approved_scheduled"
  | "completed"
  | "cancelled"
  | "expired";

interface PublicDeletionRequest {
  id: string;
  email: string;
  status: RequestStatus;
  requestedAt?: string;
  scheduledDeletionAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  dataSummary?: {
    deleted: string[];
    retained: string[];
  };
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Gluvia AI";
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "muhammedabiodun42@gmail.com";

const formatDate = (value?: string) => {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const statusLabel: Record<RequestStatus, string> = {
  verification_sent: "Verification sent",
  pending_admin_review: "Waiting for review",
  approved_scheduled: "Deletion scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  expired: "Expired",
};

export default function DeleteAccountPage() {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"email" | "code" | "status">("email");
  const [request, setRequest] = React.useState<PublicDeletionRequest | null>(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await api.post("/privacy/account-deletion/request-code", { email });
      setStep("code");
      setMessage("We sent a 6-digit verification code to that email address.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not send verification code"));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const response = await api.post("/privacy/account-deletion/verify-code", {
        email,
        code,
      });
      const payload = getResponseData<{
        request: PublicDeletionRequest;
        message: string;
      }>(response);
      setRequest(payload?.request || null);
      setMessage(payload?.message || "Deletion request loaded.");
      setStep("status");
    } catch (err) {
      setError(getErrorMessage(err, "Could not verify the code"));
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const response = await api.post("/privacy/account-deletion/cancel", {
        email,
        code,
      });
      const payload = getResponseData<{ request: PublicDeletionRequest }>(response);
      setRequest(payload?.request || null);
      setMessage("Your deletion request was cancelled.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not cancel this deletion request"));
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel =
    request?.status === "pending_admin_review" ||
    request?.status === "approved_scheduled" ||
    request?.status === "verification_sent";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="px-2">
            <Link href="/privacy">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Privacy policy
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <section className="space-y-6">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <IconTrash className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Delete your {APP_NAME} account
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Use this page to request deletion of your Gluvia AI account
                  and associated app data. We verify your email before creating
                  or changing a deletion request.
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">How the request works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>1. Enter the email address used for your Gluvia AI account.</p>
                <p>2. Enter the 6-digit code sent to that email address.</p>
                <p>
                  3. Your request is reviewed by an administrator. Once approved,
                  deletion is completed immediately or scheduled for 15 or 30 days.
                </p>
                <p>
                  4. You can cancel a pending or scheduled deletion request before
                  the deletion is completed.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data deleted</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Account credentials and profile data</p>
                  <p>Meal logs and nutrition history</p>
                  <p>Glucose readings, symptoms, and notes</p>
                  <p>AI chat conversations</p>
                  <p>Device tokens, notifications, and sync checkpoints</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data retained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Audit logs and deletion request records may be retained for
                    up to 90 days after completion or cancellation.
                  </p>
                  <p>
                    This retention is used for security, abuse prevention, and
                    compliance traceability.
                  </p>
                  <Separator />
                  <p>
                    Partial data deletion is not available separately in this
                    version. This page requests full account deletion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request deletion</CardTitle>
              </CardHeader>
              <CardContent>
                {step === "email" && (
                  <form onSubmit={requestCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Account email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <Button className="w-full" disabled={isLoading}>
                      {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send verification code
                    </Button>
                  </form>
                )}

                {step === "code" && (
                  <form onSubmit={verifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Verification code</Label>
                      <Input
                        id="code"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        required
                      />
                    </div>
                    <Button className="w-full" disabled={isLoading || code.length !== 6}>
                      {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify and submit request
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep("email")}
                    >
                      Use a different email
                    </Button>
                  </form>
                )}

                {step === "status" && request && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{request.email}</p>
                        <Badge variant="secondary">{statusLabel[request.status]}</Badge>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <p>Requested: {formatDate(request.requestedAt)}</p>
                        {request.scheduledDeletionAt && (
                          <p>Scheduled: {formatDate(request.scheduledDeletionAt)}</p>
                        )}
                        {request.cancelledAt && <p>Cancelled: {formatDate(request.cancelledAt)}</p>}
                        {request.completedAt && <p>Completed: {formatDate(request.completedAt)}</p>}
                      </div>
                    </div>

                    {canCancel && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={cancelRequest}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <IconX className="mr-2 h-4 w-4" />
                        )}
                        Cancel deletion request
                      </Button>
                    )}

                    {request.status === "completed" && (
                      <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                        <IconCheck className="mt-0.5 h-4 w-4 text-primary" />
                        <p>Your account deletion has been completed.</p>
                      </div>
                    )}
                  </div>
                )}

                {message && (
                  <p className="mt-4 rounded-lg border bg-primary/5 p-3 text-sm text-primary">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Need help? Contact{" "}
              <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
