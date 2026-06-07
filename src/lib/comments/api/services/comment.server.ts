"server-only";

import { AxiosResponse } from "axios";
import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Comment,
  CommentCreate,
  CommentFilters,
  CommentUpdate,
  CommentsResult,
} from "@/lib/comments/api/types";
import {
  parseCommentApiCreate,
  parseCommentApiUpdate,
} from "@/lib/comments/schemas/comment";
import { ApiErrorResponse } from "@/lib/_/errors/api-error.server";
import { ApiError, badRequestApiError } from "@/lib/_/errors/api-error";
import { Result } from "@/lib/_/errors/response.model";
import { validateId } from "@/utils";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: { comments: commentsUrl },
    },
  },
} = environment;

const logger = getLogger("server");

/**
 * Fetch all comments
 */
export async function getComments(
  filters?: CommentFilters,
): Promise<Result<CommentsResult, ApiError>> {
  try {
    const res = await apiClient().get<unknown, AxiosResponse<CommentsResult>>(
      commentsUrl,
      {
        params: filters,
      },
    );

    logger.debug({ count: res.data?.data?.length || 0 }, "Comments fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({}, "Failed to fetch comments");
    return {
      ok: false,
      error: ApiErrorResponse(error, "getComments"),
    };
  }
}

/**
 * Fetch a single comment by ID
 */
export async function getCommentById(
  id: number,
): Promise<Result<Comment, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient().get<unknown, AxiosResponse<Comment>>(
      `${commentsUrl}/${id}`,
    );

    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "getCommentById"),
    };
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  comment: CommentCreate,
): Promise<Result<Comment, ApiError>> {
  const parse = parseCommentApiCreate(comment);
  if (!parse.success) {
    logger.warn(
      { context: "createComment" },
      "Validation failed for comment creation",
    );
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  try {
    const res = await apiClient().post<unknown, AxiosResponse<Comment>>(
      commentsUrl,
      parse.data,
    );
    logger.info(
      { id: res.data.id, content: res.data.content },
      "Comment created successfully",
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ content: comment.content }, "Failed to create comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createComment"),
    };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  id: number,
  comment: CommentUpdate,
): Promise<Result<Comment, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseCommentApiUpdate(comment);
  if (!parse.success) {
    logger.warn(
      { context: "updateComment" },
      "Validation failed for comment update",
    );
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  try {
    const res = await apiClient().patch<unknown, AxiosResponse<Comment>>(
      `${commentsUrl}/${id}`,
      parse.data,
    );
    logger.info(
      { id, content: res.data.content },
      "Comment updated successfully",
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updateComment"),
    };
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient().delete(`${commentsUrl}/${id}`);
    logger.info({ id }, "Comment deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete comment");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deleteComment"),
    };
  }
}
