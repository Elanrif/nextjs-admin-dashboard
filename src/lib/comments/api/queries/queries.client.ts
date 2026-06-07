import { queryOptions } from "@tanstack/react-query";
import type { CommentFilters } from "../types";
import { fetchCommentById, fetchComments } from "../services/comment.client";
import { commentKeys } from ".";

export const commentsQueryOptions = (filters: CommentFilters) =>
  queryOptions({
    queryKey: commentKeys.list(filters),
    queryFn: () => fetchComments(filters),
  });

export const commentByIdOptions = (id: number) =>
  queryOptions({
    queryKey: commentKeys.detail(id),
    queryFn: () => fetchCommentById(id),
  });
