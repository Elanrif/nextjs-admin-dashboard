import { CommentFilters } from "../types";

export const commentKeys = {
  all: ["comments"] as const,
  list: (filters?: CommentFilters) =>
    [...commentKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...commentKeys.all, "detail", id] as const,
};
