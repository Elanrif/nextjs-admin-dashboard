"server-only";

import { AxiosResponse } from "axios";
import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Post,
  PostCreate,
  PostFilters,
  PostUpdate,
  PostsResult,
} from "@/lib/posts/api/types";
import {
  parsePostApiCreate,
  parsePostApiUpdate,
} from "@/lib/posts/schemas/post";
import { ApiErrorResponse } from "@/lib/_/errors/api-error.server";
import { Result } from "@/lib/_/errors/response.model";
import { ApiError, badRequestApiError } from "@/lib/_/errors/api-error";
import { validateId } from "@/utils";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: { posts: postsUrl },
    },
  },
} = environment;

const logger = getLogger("server");

/**
 * Fetch all posts
 */
export async function getPosts(
  filters?: PostFilters,
): Promise<Result<PostsResult, ApiError>> {
  try {
    const res = await apiClient().get<unknown, AxiosResponse<PostsResult>>(
      postsUrl,
      {
        params: filters,
      },
    );
    logger.debug({ count: res.data?.data?.length || 0 }, "Posts fetched");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({}, "Failed to fetch posts");
    return {
      ok: false,
      error: ApiErrorResponse(error, "getPosts"),
    };
  }
}

/**
 * Fetch a single post by ID
 */
export async function getPostById(id: number): Promise<Result<Post, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient().get<unknown, AxiosResponse<Post>>(
      `${postsUrl}/${id}`,
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to fetch post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "getPostById"),
    };
  }
}

/**
 * Create a new post
 */
export async function createPost(
  post: PostCreate,
): Promise<Result<Post, ApiError>> {
  const parse = parsePostApiCreate(post);
  if (!parse.success) {
    logger.warn(
      { context: "createPost" },
      "Validation failed for post creation",
    );
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }
  try {
    const res = await apiClient().post<unknown, AxiosResponse<Post>>(
      postsUrl,
      parse.data,
    );
    logger.info(
      { id: res.data.id, title: res.data.title },
      "Post created successfully",
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ title: post.title }, "Failed to create post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "createPost"),
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: number,
  post: PostUpdate,
): Promise<Result<Post, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parsePostApiUpdate(post);
  if (!parse.success) {
    logger.warn({ context: "updatePost" }, "Validation failed for post update");
    return {
      ok: false,
      error: badRequestApiError(parse.error.message),
    };
  }

  try {
    const res = await apiClient().patch<unknown, AxiosResponse<Post>>(
      `${postsUrl}/${id}`,
      parse.data,
    );
    logger.info({ id, title: res.data.title }, "Post updated successfully");
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error({ id }, "Failed to update post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "updatePost"),
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient().delete(`${postsUrl}/${id}`);
    logger.info({ id }, "Post deleted successfully");
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error({ id }, "Failed to delete post");
    return {
      ok: false,
      error: ApiErrorResponse(error, "deletePost"),
    };
  }
}
