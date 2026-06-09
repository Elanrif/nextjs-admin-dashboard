import { NextRequest, NextResponse } from "next/server";
import { CommentFilters } from "@/lib/comments/api/types";
import { getComments } from "@/lib/comments/api/services/comment.server";

export const dynamic = "force-dynamic";

/**
 * GET /api/comments
 * Fetch all comments
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters: CommentFilters = {
    postId: searchParams.get("postId")
      ? Number(searchParams.get("postId"))
      : undefined,
    authorId: searchParams.get("authorId")
      ? Number(searchParams.get("authorId"))
      : undefined,
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined,
    size: searchParams.get("size")
      ? Number(searchParams.get("size"))
      : undefined,
    sort: searchParams.get("sort") ?? undefined,
  };
  const response = await getComments(filters);
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
