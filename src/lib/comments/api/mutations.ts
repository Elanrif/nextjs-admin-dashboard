import { mutationOptions } from "@tanstack/react-query";
import { commentKeys } from "./queries";
import { CommentCreate, CommentUpdate } from "./types";
import { getQueryClient } from "@/lib/query-client";
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "./action";

export const createCommentMutation = mutationOptions({
  mutationFn: (data: CommentCreate) => createCommentAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
  },
});

export const updateCommentMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: CommentUpdate }) =>
    updateCommentAction(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
  },
});

export const deleteCommentMutation = mutationOptions({
  mutationFn: (id: number) => deleteCommentAction(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
  },
});
