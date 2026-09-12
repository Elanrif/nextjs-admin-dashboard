import { NextResponse } from "next/server";
import { Result } from "@/lib/shared/types";

export function resultResponse<T, E extends { status?: number }>(
  result: Result<T, E>,
): NextResponse {
  const status =
    !result.ok && (result.error.status === 401 || result.error.status === 403)
      ? result.error.status
      : 200;

  return NextResponse.json(result, { status });
}
