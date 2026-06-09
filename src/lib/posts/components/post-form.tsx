// components/posts/PostForm.tsx
// Formulaire de création/édition de post
// Utilise react-hook-form + zod pour la validation
// Compatible avec shadcn/ui (Card, Input, Button, Select)

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  postCreateSchema,
  postUpdateSchema,
  type PostFormValues,
  type PostUpdateFormValues,
} from "../schemas/post";
import type { Post, PostCreate, PostUpdate } from "../api/types";
import { createPostMutation, updatePostMutation } from "../api/mutations";

interface PostFormProps {
  initialData: Post | null;
  pageTitle: string;
}

export function PostForm({ initialData, pageTitle }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const formSchema = isEdit ? postUpdateSchema : postCreateSchema;

  // react-hook-form avec validation Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues | PostUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: initialData?.title ?? "",
          description: initialData?.description ?? "",
          imageUrl: initialData?.imageUrl ?? "",
        }
      : {
          title: "",
          description: "",
          imageUrl: "",
        },
  });

  // Mutation création
  const createMutation = useMutation({
    ...createPostMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to create post");
        return;
      }
      toast.success("Post created successfully");
      router.push("/posts");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  // Mutation modification
  const updateMutation = useMutation({
    ...updatePostMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to update post");
        return;
      }
      toast.success("Post updated successfully");
      router.push("/posts");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const onSubmit = (values: PostFormValues | PostUpdateFormValues) => {
    if (isEdit) {
      const updateValues = values as PostUpdateFormValues;
      const payload: PostUpdate = {
        title: updateValues.title ?? "",
        description: updateValues.description ?? "",
        imageUrl: updateValues.imageUrl ?? "",
      };

      updateMutation.mutate({
        id: initialData.id,
        values: payload,
      });
    } else {
      const createValues = values as PostFormValues;
      const payload: PostCreate = {
        title: createValues.title,
        description: createValues.description,
        imageUrl: createValues.imageUrl,
        authorId: 1, // À récupérer du contexte utilisateur
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
