import { queryOptions } from "@tanstack/react-query";
import type { PostFilters } from "../types";
import { fetchPostById, fetchPosts } from "../services/post.client";
import { postKeys } from ".";

export const postsQueryOptions = (filters: PostFilters) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
  });

export const postByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPostById(id),
  });
