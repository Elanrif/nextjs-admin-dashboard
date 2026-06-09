import { ApiError } from "@/lib/_/errors/api-error";
import { Result } from "@/lib/_/errors/response.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
}

export function isValidImgUrl(url: unknown): url is string {
  if (typeof url !== "string" || url.length === 0) return false;
  // Must be absolute URL or relative path starting with /
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

export function validateId(id: number): Result<never, ApiError> | null {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        detail: "Invalid user ID",
        title: "Bad Request",
        instance: undefined,
        errorCode: "INVALID_ID",
      },
    };
  }
  return null;
}
