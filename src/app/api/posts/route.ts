import { NextRequest, NextResponse } from "next/server";
import { PostFilters } from "@/lib/posts/api/types";
import { getPosts } from "@/lib/posts/api/services/post.server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
  const filters: PostFilters = {
    page: sp.has("page") ? Number(sp.get("page")) : undefined,
    size: sp.has("size")
      ? Number(sp.get("size"))
      : sp.has("perPage")
        ? Number(sp.get("perPage"))
        : undefined,
    authorId: Number(sp.get("authorId"))
      ? Number(sp.get("authorId"))
      : undefined,
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };
  const response = await getPosts(filters);
  
  return NextResponse.json(response, { status: 200 });
}
