"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/users/api/types";
import { useSession } from "./auth.context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  guestOnly = false,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (guestOnly && user) {
      router.replace("/dashboard");
      return;
    }

    if (!guestOnly && !user) {
      router.replace(redirectTo);
      return;
    }

    if (adminOnly && user?.role !== UserRole.ADMIN) {
      router.replace("/account");
    }
  }, [user, isLoading, router, adminOnly, guestOnly, redirectTo]);

  // Wait until the loading state is resolved before rendering children
  if (isLoading) return null;

  // Render children only if the conditions are met
  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;
  if (adminOnly && user?.role !== UserRole.ADMIN) return null;

  return <>{children}</>;
}
