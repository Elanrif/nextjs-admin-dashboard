import { UserSummary } from "@/lib/users/api/types";

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type CommentFilters = {
  postId?: number;
  authorId?: number;
  page?: number;
  size?: number;
  sort?: string;
};

export type CommentsResult = {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

// ============================================================================
// MUTATION PAYLOADS
// ============================================================================

export interface CommentCreate {
  content: string;
  postId: number;
  authorId: number;
}

export type CommentUpdate = Partial<CommentCreate>;
