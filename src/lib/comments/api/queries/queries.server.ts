import { queryOptions } from "@tanstack/react-query";
import type { CommentFilters } from "../types";
import { commentKeys } from ".";
import { getCommentById, getComments } from "../services/comment.server";

export const commentsQueryOptions = (filters: CommentFilters) =>
  queryOptions({
    queryKey: commentKeys.list(filters),
    queryFn: () => getComments(filters),
  });

export const commentByIdOptions = (id: number) =>
  queryOptions({
    queryKey: commentKeys.detail(id),
    queryFn: () => getCommentById(id),
  });
