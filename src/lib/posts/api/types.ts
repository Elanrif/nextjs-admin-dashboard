/**
 * Post types — API response models (no validation)
 * See: src/lib/posts/schemas/post.schema.ts for form validation
 */

import { UserSummary } from "@/lib/users/api/types";

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type PostFilters = {
  page?: number;
  size?: number;
  sort?: string;
};

export type PostsResult = {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

// ============================================================================
// MUTATION PAYLOADS
// ============================================================================

export interface PostCreate {
  title: string;
  imageUrl: string;
  description: string;
  likes?: number;
  authorId: number;
}

export type PostUpdate = Partial<PostCreate>;
