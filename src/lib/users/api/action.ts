"use server";

import { revalidatePath } from "next/cache";
import { User } from "./types";
import { createUser, deleteUser, updateUser } from "./services/user.server";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import { UserFormValues } from "@/lib/auth/schemas/auth";
import { UserUpdateFormValues } from "../schemas/user";

export async function createUserAction(
  data: UserFormValues,
): Promise<Result<User, ApiError>> {
  const result = await createUser(data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function updateUserAction(
  id: number,
  data: UserUpdateFormValues,
): Promise<Result<User, ApiError>> {
  const result = await updateUser(id, data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function deleteUserAction(
  id: number,
): Promise<Result<void, ApiError>> {
  const result = await deleteUser(id);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}
