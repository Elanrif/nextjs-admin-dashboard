import "server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { User, UserFilters, UsersResponse } from "@/lib/users/api/types";
import {
  parseUserCreate,
  parseUserUpdate,
  UserUpdateFormValues,
} from "@/lib/users/schemas/user";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import { checkValidId } from "@/utils";
import { UserFormValues } from "@/lib/auth/schemas/auth";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = environment;

const logger = getLogger("server");

const userUrl = (id: number) => `${usersUrl}/${id}`;

export async function getUsers(
  filters: UserFilters = {},
): Promise<Result<UsersResponse, ApiError>> {
  try {
    const res = await apiClient(true).get<UsersResponse>(
      usersUrl,
      {
        params: filters,
      },
    );

    logger.info({ count: res.data?.content?.length || 0 }, "Users fetched");

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getUsers"),
    };
  }
}

export async function getUserById(id: number): Promise<Result<User, ApiError>> {
  const idCheck = checkValidId(id);
  if (idCheck) return idCheck;

  try {
    const response = await apiClient(true).get<User>(
      userUrl(id),
    );

    logger.info({ id: response.data.id }, "User fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getUserById"),
    };
  }
}

export async function createUser(
  user: UserFormValues,
): Promise<Result<User, ApiError>> {
  const parse = parseUserCreate(user);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "User creation"),
    };
  }

  try {
    const res = await apiClient(true).post<User>(usersUrl, parse.data);

      logger.info(
        { id: res.data.id, content: res.data.email },
        "User created successfully",
      );

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "createUser"),
    };
  }
}

export async function updateUser(
  id: number,
  user: UserUpdateFormValues,
): Promise<Result<User, ApiError>> {
  const idCheck = checkValidId(id, "user");
  if (idCheck) return idCheck;

  const parse = parseUserUpdate(user);

   if (!parse.success) {
     return {
       ok: false,
       error: fromZodError(parse.error, "User update"),
     };
   }

  try {
    const response = await apiClient(true).patch<User>(userUrl(id), parse.data);

    logger.info({ id, email: response.data.email }, "User updated");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "updateUser"),
    };
  }
}

export async function deleteUser(id: number): Promise<Result<void, ApiError>> {
  const idCheck = checkValidId(id, "user");
  if (idCheck) return idCheck;

  try {
    await apiClient(true).delete(userUrl(id));
    logger.info({ id}, "User deleted");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "deleteUser"),
    };
  }
}
