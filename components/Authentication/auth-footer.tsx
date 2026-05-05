import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldCheck } from "@hugeicons/core-free-icons";

export function AuthFooter() {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <div className="flex items-center gap-1.5 rounded-full border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted">
        <HugeiconsIcon
          icon={ShieldCheck}
          strokeWidth={2}
          className="h-3.5 w-3.5 text-primary shrink-0"
        />
        <span>Your data is protected under our</span>
        <Link
          href="/privacy"
          target="_blank"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
