import { mutationOptions } from "@tanstack/react-query";
import { postKeys } from "./queries";
import { PostCreate, PostUpdate } from "./types";
import { getQueryClient } from "@/lib/query-client";
import { createPostAction, deletePostAction, updatePostAction } from "./action";

export const createPostMutation = mutationOptions({
  mutationFn: (data: PostCreate) => createPostAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const updatePostMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: PostUpdate }) =>
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
