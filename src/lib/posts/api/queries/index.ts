import type { PostFilters } from "../types";

export const postKeys = {
  all: ["posts"] as const,
  list: (filters?: PostFilters) =>
    [...postKeys.all, "list", filters ?? {}] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};
