import { queryOptions } from "@tanstack/react-query";
import type { UserFilters } from "../types";
import { fetchUserById, fetchUsers } from "../services/user.client";
import { userKeys } from ".";

export const usersQueryOptions = (filters: UserFilters) =>
  queryOptions({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });

export const userByIdOptions = (id: number) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
  });
