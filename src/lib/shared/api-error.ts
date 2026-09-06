import "server-only";

import { AxiosError } from "axios";
import { getLogger } from "@/config/logger.config";
import { ZodError } from "zod";

const logger = getLogger("server");

export type ApiError = {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
};

export function ApiError(error: unknown, context?: string): ApiError {
  const apiError =
    error instanceof AxiosError
      ? fromAxiosError(error)
      : fromUnknownError(error);

  logApiError(apiError, context);

  return apiError;
}

function fromAxiosError(error: AxiosError): ApiError {
  const data = error.response?.data as Partial<ApiError> | undefined;

  return {
    timestamp: data?.timestamp,
    status: data?.status ?? error.response?.status ?? 500,
    error: data?.error ?? "Internal Server Error",
    message: data?.message ?? error.message ?? "Unknown Axios error",
    path: data?.path,
  };
}

function fromUnknownError(error: unknown): ApiError {
  return {
    status: 500,
    error: "Internal Server Error",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

function logApiError(error: ApiError, context?: string): void {
  const prefix = `[API Error] [${context ?? "unknown"}]`;

  if (error.status >= 500) {
    logger.error(error, prefix);
  } else {
    logger.warn(error, prefix);
  }
}

export function fromZodError(error: ZodError, context: string): ApiError {
  const apiError: ApiError = {
    status: 400,
    error: "Bad Request",
    message: error.message,
  };
  logger.warn(
    { ...apiError, errors: error.format() },
    `[API Error] [${context}]`,
  );
  return apiError;
}