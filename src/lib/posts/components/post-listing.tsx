import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { postsQueryOptions } from "../api/queries/queries.server";
import { PostsTable } from "./posts-table";

export default function PostListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("title");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sort && { sort }),
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(postsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsTable />
    </HydrationBoundary>
  );
}
