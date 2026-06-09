// components/comments/CommentForm.tsx
// Formulaire de création/édition de commentaire
// Utilise react-hook-form + zod pour la validation
// Compatible avec shadcn/ui (Card, Input, Button)

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  commentCreateSchema,
  commentUpdateSchema,
  type CommentFormValues,
  type CommentUpdateFormValues,
} from "../schemas/comment";
import type { Comment, CommentCreate, CommentUpdate } from "../api/types";
import { createCommentMutation, updateCommentMutation } from "../api/mutations";

interface CommentFormProps {
  initialData: Comment | null;
  pageTitle: string;
}

export function CommentForm({ initialData, pageTitle }: CommentFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const formSchema = isEdit ? commentUpdateSchema : commentCreateSchema;

  // react-hook-form avec validation Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues | CommentUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          content: initialData?.content ?? "",
        }
      : {
          content: "",
        },
  });

  // Mutation création
  const createMutation = useMutation({
    ...createCommentMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to create comment");
        return;
      }
      toast.success("Comment created successfully");
      router.push("/comments");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create comment");
    },
  });

  // Mutation modification
  const updateMutation = useMutation({
    ...updateCommentMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to update comment");
        return;
      }
      toast.success("Comment updated successfully");
      router.push("/comments");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  const onSubmit = (values: CommentFormValues | CommentUpdateFormValues) => {
    if (isEdit) {
      const updateValues = values as CommentUpdateFormValues;
      const payload: CommentUpdate = {
        content: updateValues.content ?? "",
      };

      updateMutation.mutate({
        id: initialData.id,
        values: payload,
      });
    } else {
      const createValues = values as CommentFormValues;
      const payload: CommentCreate = {
        content: createValues.content,
        postId: 1, // À récupérer du contexte/params
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
