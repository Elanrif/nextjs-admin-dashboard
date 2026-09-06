import { mutationOptions } from "@tanstack/react-query";
import { postKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { createPostAction, deletePostAction, updatePostAction } from "./action";
import { PostCreateFormValues, PostUpdateFormValues } from "../schemas/post";

export const createPostMutation = mutationOptions({
  mutationFn: (data: PostCreateFormValues) => createPostAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const updatePostMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: PostUpdateFormValues }) =>
    updatePostAction(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const deletePostMutation = mutationOptions({
  mutationFn: (id: number) => deletePostAction(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});
