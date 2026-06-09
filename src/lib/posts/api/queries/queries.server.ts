import { queryOptions } from "@tanstack/react-query";
import type { PostFilters } from "../types";
import { postKeys } from ".";
import { getPostById, getPosts } from "../services/post.server";

export const postsQueryOptions = (filters: PostFilters) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => getPosts(filters),
  });

export const postByIdOptions = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
  });
