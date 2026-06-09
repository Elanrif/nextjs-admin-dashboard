import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { commentsQueryOptions } from "../api/queries/queries.server";
import { CommentsTable } from "./comments-table";

export default function CommentListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("content");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sort && { sort }),
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(commentsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentsTable />
    </HydrationBoundary>
  );
}
