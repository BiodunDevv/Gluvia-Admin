"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetToken: string | null;
  userType?: "user" | "admin"; // "user" or "admin" to customize the description
  onCopyToken: () => void;
  onCopyFullUrl: () => void;
}

export function ResetPasswordModal({
  open,
  onOpenChange,
  resetToken,
  userType = "user",
  onCopyToken,
  onCopyFullUrl,
}: ResetPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Password Reset Token Generated</DialogTitle>
          <DialogDescription>
            Provide this token to the {userType} to reset their password
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs text-muted-foreground">
                Reset Token
              </FieldLabel>
              <div className="rounded-lg border bg-muted p-4">
                <p className="font-mono text-sm break-all select-all">
                  {resetToken}
                </p>
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-xs text-muted-foreground">
                Full Reset URL
              </FieldLabel>
              <div className="rounded-lg border bg-muted p-4">
                <p className="font-mono text-xs break-all select-all">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/auth/reset-password?token=${resetToken}`}
                </p>
              </div>
            </Field>

            <p className="text-sm text-muted-foreground">
              💡 The {userType} can use this link to reset their password. The
              token will be automatically filled from the URL.
            </p>
          </FieldGroup>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={onCopyToken}>
            Copy Token
          </Button>
          <Button onClick={onCopyFullUrl}>Copy Full URL</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
