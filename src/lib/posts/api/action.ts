"use server";

import { revalidatePath } from "next/cache";
import { Post, PostCreate, PostUpdate } from "./types";
import { createPost, deletePost, updatePost } from "./services/post.server";
import { ApiError } from "@/lib/_/errors/api-error";
import { Result } from "@/lib/_/errors/response.model";

export async function createPostAction(
  data: PostCreate,
): Promise<Result<Post, ApiError>> {
  const result = await createPost(data);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function updatePostAction(
  id: number,
  data: PostUpdate,
): Promise<Result<Post, ApiError>> {
  const result = await updatePost(id, data);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function deletePostAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const result = await deletePost(id);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}
