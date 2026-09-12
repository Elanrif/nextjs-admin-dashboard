import { NextRequest } from "next/server";
import { CommentFilters } from "@/lib/comments/api/types";
import { getComments } from "@/lib/comments/api/services/comment.server";
import { resultResponse } from "@/lib/shared/api-response";

export const dynamic = "force-dynamic";

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
  return resultResponse(response);
}
