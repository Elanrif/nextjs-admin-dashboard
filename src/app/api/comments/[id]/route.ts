import { NextRequest } from "next/server";
import { getCommentById } from "@/lib/comments/api/services/comment.server";
import { resultResponse } from "@/lib/shared/api-response";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const commentId = Number.parseInt(id, 10);

  const response = await getCommentById(commentId);
  return resultResponse(response);
}
