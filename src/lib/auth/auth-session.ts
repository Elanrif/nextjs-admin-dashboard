"use client";

const AUTH_KEY = "auth_user";

type AuthSessionListener = () => void;

const listeners = new Set<AuthSessionListener>();

export function subscribeToAuthSessionClear(
  listener: AuthSessionListener,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearAuthSession(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_KEY);
  }

  for (const listener of listeners) {
    listener();
  }
}

export function storeAuthUser(user: unknown): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function getStoredAuthUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_KEY);
}
