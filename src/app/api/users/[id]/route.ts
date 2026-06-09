import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/users/api/services/user.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;

  const userId = Number.parseInt(id, 10);
  const response = await getUserById(userId);
  /**
   * Always return 200 OK (even on business logic errors).
   * The HTTP status only indicates network/server transport success.
   * Actual business logic errors (validation, FK violation, etc) are in response.ok:
   *   - response.ok = true: operation succeeded
   *   - response.ok = false: operation failed, see response.error for details
   * This prevents Axios from throwing exceptions for business errors.
   */
  return NextResponse.json(response, { status: 200 });
}

/**
 *  ⚠️Methods below are not used, just an example if we want to call API routes directly,
 *  from client components without going through server actions.
 *  ✅We use server actions for mutations to leverage revalidation
 *  and avoid handling client-side state management (loading, error).
 * @param user
 * @returns
 */

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Params },
// ) {
//   const { id } = await params;
//   const userId = Number.parseInt(id, 10);
//   const body = await request.json().catch(() => null);
//   const response = await updateUser(userId, body);
//   return NextResponse.json(response, { status: 200 });
// }

// export async function DELETE(
//   { params }: { params: Params },
// ) {
//   const { id } = await params;
//   const userId = Number.parseInt(id, 10);
//   const response = await deleteUser(userId);
//   return NextResponse.json(response, { status: 200 });
// }
