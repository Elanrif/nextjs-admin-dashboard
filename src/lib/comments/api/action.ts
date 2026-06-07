"use server";

import { revalidatePath } from "next/cache";
import {
  createComment,
  updateComment,
  deleteComment,
} from "./services/comment.server";
import { Comment, CommentCreate, CommentUpdate } from "./types";
import { Result } from "@/lib/_/errors/response.model";
import { ApiError } from "@/lib/_/errors/api-error";

export async function createCommentAction(
  data: CommentCreate,
): Promise<Result<Comment, ApiError>> {
  const result = await createComment(data);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}

export async function updateCommentAction(
  id: number,
  data: CommentUpdate,
): Promise<Result<Comment, ApiError>> {
  const result = await updateComment(id, data);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}

export async function deleteCommentAction(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const result = await deleteComment(id);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}
