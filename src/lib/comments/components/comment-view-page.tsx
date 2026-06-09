"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Comment } from "../api/types";
import { commentByIdOptions } from "../api/queries/queries.client";
import { CommentForm } from "./comment-form";

type TCommentViewPageProps = {
  commentId: string;
};

export default function CommentViewPage({ commentId }: TCommentViewPageProps) {
  if (commentId === "new") {
    return <CommentForm initialData={null} pageTitle="Create New Comment" />;
  }

  return <EditCommentView commentId={Number(commentId)} />;
}

function EditCommentView({ commentId }: { commentId: number }) {
  const { data } = useSuspenseQuery(commentByIdOptions(commentId));

  if (!data?.ok || !data?.data) {
    notFound();
  }

  return (
    <CommentForm initialData={data.data as Comment} pageTitle="Edit Comment" />
  );
}
