import { PageResponse } from "@/lib/shared/types";
import { UserSummary } from "@/lib/users/api/types";

export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export type CommentsResponse = PageResponse<Comment>;

export type CommentFilters = {
  postId?: number;
  authorId?: number;
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
};
