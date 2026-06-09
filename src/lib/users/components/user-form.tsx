// components/users/UserForm.tsx
// Formulaire de création/édition d'utilisateur
// Utilise react-hook-form + zod pour la validation
// Compatible avec shadcn/ui (Card, Input, Button, Select)

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  userCreateSchema,
  userUpdateSchema,
  type UserFormValues,
  type UserUpdateFormValues,
} from "../schemas/user";
import { User, UserRole, type UserCreate, type UserUpdate } from "../api/types";
import { userOptions } from "../constants/user-options";
import { createUserMutation, updateUserMutation } from "../api/mutations";

interface UserFormProps {
  initialData: User | null;
  pageTitle: string;
}

export function UserForm({ initialData, pageTitle }: UserFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const formSchema = isEdit ? userUpdateSchema : userCreateSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // react-hook-form avec validation Zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues | UserUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: initialData?.firstName ?? "",
          lastName: initialData?.lastName ?? "",
          email: initialData?.email ?? "",
          phoneNumber: initialData?.phoneNumber ?? "",
          role: initialData?.role ?? UserRole.USER,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          role: UserRole.USER,
          password: "",
          confirmPassword: "",
        },
  });

  // Synchroniser le select avec react-hook-form
  useEffect(() => {
    if (initialData?.role) {
      setValue("role", initialData.role);
    }
  }, [initialData, setValue]);

  // Mutation création
  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to create user");
        return;
      }
      toast.success("User created successfully");
      router.push("/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  // Mutation modification
  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to update user");
        return;
      }
      toast.success("User updated successfully");
      router.push("/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const onSubmit = (values: UserFormValues | UserUpdateFormValues) => {
    if (isEdit) {
      const updateValues = values as UserUpdateFormValues;
      const payload: UserUpdate = {
        firstName: updateValues.firstName ?? "",
        lastName: updateValues.lastName ?? "",
        email: updateValues.email ?? "",
        phoneNumber: updateValues.phoneNumber ?? "",
        role: updateValues.role ?? UserRole.USER,
      };

      updateMutation.mutate({
        id: initialData.id,
        values: payload,
      });
    } else {
      const createValues = values as UserFormValues;
      const payload: UserCreate = {
        firstName: createValues.firstName,
        lastName: createValues.lastName,
        email: createValues.email,
        phoneNumber: createValues.phoneNumber,
        role: createValues.role,
        password: createValues.password,
        confirmPassword: createValues.confirmPassword,
      };

      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-4">
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-yellow-800 mb-2">
          ⚠️ À définir
        </h2>
        <p className="text-sm text-yellow-700">
          Le formulaire doit être implémenté ici — ceci est un
          exemple / placeholder.
        </p>
      </div>
    </div>
  );
}
