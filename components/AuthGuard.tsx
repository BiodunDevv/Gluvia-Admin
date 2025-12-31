"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, getMe } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const publicRoutes = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const initAuth = async () => {
      // If on auth page and have token, redirect to dashboard
      if (isPublicRoute && token) {
        router.replace("/dashboard");
        return;
      }

      // If on protected route and no token, redirect to login
      if (!isPublicRoute && !token) {
        router.replace("/auth/login");
        return;
      }

      // If have token but no user data, fetch user
      if (token && !user) {
        const success = await getMe();
        // If getMe fails, user will be logged out by interceptor
        // So we should check again
        if (!success) {
          router.replace("/auth/login");
          return;
        }
      }

      setIsReady(true);
    };

    initAuth();
  }, [pathname, token, user, getMe, isPublicRoute, router]);

  // Show loading only on initial mount
  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
