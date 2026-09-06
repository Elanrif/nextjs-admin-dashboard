import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/posts/api/services/post.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  const response = await getPostById(postId);
  
  return NextResponse.json(response, { status: 200 });
}
