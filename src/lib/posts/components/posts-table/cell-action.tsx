"use client";
import type { Post } from "../../api/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePostMutation } from "../../api/mutations";
import type { ApiError } from "@/lib/_/errors/api-error";
import type { Result } from "@/lib/_/errors/response.model";

interface CellActionProps {
  data: Post;
}

export function CellAction({ data }: CellActionProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteMutation = useMutation({
    ...deletePostMutation,
    onSuccess: (result: Result<{ success: boolean }, ApiError>) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to delete post");
        return;
      }

      toast.success("Post deleted successfully");
      setOpen(false);
    },
  });

    return (
      <>
        AlertModal à définir pour confirmer la suppression d&apos;un post
      </>
    );
}
