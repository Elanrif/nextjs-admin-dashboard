import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Post, PostFilters, PostsResult } from "@/lib/posts/api/types";
import { Result } from "@/lib/_/errors/response.model";
import { ApiError } from "@/lib/_/errors/api-error";

const {
  api: {
    rest: {
      endpoints: { posts: postsUrl },
    },
  },
} = proxyEnvironment;

/**
 * Fetch all posts (client-side)
 */
export async function fetchPosts(
  filters?: PostFilters,
): Promise<Result<PostsResult, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<PostsResult, ApiError>>
  >(postsUrl, { params: filters });
  return res.data;
}

/**
 * Fetch a single post by ID (client-side)
 */
export async function fetchPostById(
  id: number,
): Promise<Result<Post, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<Post, ApiError>>
  >(`${postsUrl}/${id}`);
  return res.data;
}
