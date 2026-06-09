import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/api/services/auth.server";
import { Registrer } from "@/lib/auth/api/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Registrer;
  const res = await signUp(body);
  /**
   * Always return 200 OK (even on business logic errors).
   * The HTTP status only indicates network/server transport success.
   * Actual business logic errors (validation, FK violation, etc) are in response.ok:
   *   - response.ok = true: operation succeeded
   *   - response.ok = false: operation failed, see response.error for details
   * This prevents Axios from throwing exceptions for business errors.
   */
  return NextResponse.json(res, { status: 200 });
}
