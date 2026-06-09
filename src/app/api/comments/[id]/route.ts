import { NextRequest, NextResponse } from "next/server";
import { getCommentById } from "@/lib/comments/api/services/comment.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
/**
 * GET /api/comments/[id]
 * Fetch a comment by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const commentId = Number.parseInt(id, 10);

  const response = await getCommentById(commentId);
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
