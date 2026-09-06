"use client";

import { mutationOptions, useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth/api/services/auth.client";
import {
  deleteMyAccountAction,
  updateMyAccountAction,
  updateMyPasswordAction,
} from "./action";
import { userKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import {
  ChangePwdFormValues,
  DeleteFormValues,
  LoginFormValues,
  RegisterFormValues,
  UserCreateFormValues,
} from "../schemas/auth";

export function useSignInMutation() {
  return useMutation({
    mutationFn: (data: LoginFormValues) => signIn(data),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (data: RegisterFormValues) => signUp(data),
  });
}

export const updateMyAccountMutation = mutationOptions({
  mutationFn: (values: UserCreateFormValues) => updateMyAccountAction(values),

  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateMyPasswordMutation = mutationOptions({
  mutationFn: (values: ChangePwdFormValues) => updateMyPasswordAction(values),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteMyAccountMutation = mutationOptions({
  mutationFn: (values: DeleteFormValues) => deleteMyAccountAction(values),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
