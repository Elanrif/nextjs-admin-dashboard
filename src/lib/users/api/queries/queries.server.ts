import { queryOptions } from "@tanstack/react-query";
import type { UserFilters } from "../types";
import { userKeys } from ".";
import { getUserById, getUsers } from "../services/user.server";

export const usersQueryOptions = (filters: UserFilters) =>
  queryOptions({
    queryKey: userKeys.list(filters),
    queryFn: () => getUsers(filters),
  });

export const userByIdOptions = (id: number) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
  });
