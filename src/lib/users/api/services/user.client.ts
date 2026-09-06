import { proxyEnvironment } from "@config/proxy-api.config";
import { User, UserFilters, UsersResponse } from "@lib/users/api/types";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = proxyEnvironment;

export async function fetchUsers(
  filters: UserFilters = {},
): Promise<Result<UsersResponse, ApiError>> {
  const res = await frontendHttp().get<Result<UsersResponse, ApiError>>(
    usersUrl,
    {params: filters}
  );
  return res.data;
}

export async function fetchUserById(
  id: number,
): Promise<Result<User, ApiError>> {
  const res = await frontendHttp().get<Result<User, ApiError>>(
    `${usersUrl}/${id}`,
    { params: { id } }
  );
  return res.data;
}
