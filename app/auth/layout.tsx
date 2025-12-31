"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, isHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for hydration
    if (!isHydrated) {
      return;
    }

    // If user has a token, they're authenticated - redirect to dashboard
    if (token) {
      router.replace("/dashboard");
    }
  }, [isHydrated, token, router]);

  // Show nothing while checking auth (or redirect happens)
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If user has token, show loading while redirect happens
  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
