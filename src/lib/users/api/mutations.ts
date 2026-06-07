import { mutationOptions } from "@tanstack/react-query";
import { userKeys } from "./queries";
import { UserCreate, UserUpdate } from "./types";
import { getQueryClient } from "@/lib/query-client";
import { createUserAction, deleteUserAction, updateUserAction } from "./action";

export const createUserMutation = mutationOptions({
  mutationFn: (data: UserCreate) => createUserAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: UserUpdate }) =>
    updateUserAction(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions({
  mutationFn: (id: number) => deleteUserAction(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
