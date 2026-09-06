import { mutationOptions } from "@tanstack/react-query";
import { commentKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "./action";
import { CommentFormValues, CommentUpdateFormValues } from "../schemas/comment";

export const createCommentMutation = mutationOptions({
  mutationFn: (data: CommentFormValues) => createCommentAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
  },
});

export const updateCommentMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: CommentUpdateFormValues }) =>
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
