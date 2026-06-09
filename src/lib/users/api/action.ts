"use server";

import { revalidatePath } from "next/cache";
import { User, UserCreate, UserUpdate } from "./types";
import { createUser, deleteUser, updateUser } from "./services/user.server";
import { Result } from "@/lib/_/errors/response.model";
import { ApiError } from "@/lib/_/errors/api-error";

export async function createUserAction(
  data: UserCreate,
): Promise<Result<User, ApiError>> {
  const result = await createUser(data);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function updateUserAction(
  id: number,
  data: UserUpdate,
): Promise<Result<User, ApiError>> {
  const result = await updateUser(id, data);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function deleteUserAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const result = await deleteUser(id);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}
