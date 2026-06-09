"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Post } from "../api/types";
import { postByIdOptions } from "../api/queries/queries.client";
import { PostForm } from "./post-form";
import PostDetails from "./post-details";

type TPostViewPageProps = {
  postId: string;
};

export default function PostViewPage({ postId }: TPostViewPageProps) {
  if (postId === "new") {
    return <PostForm initialData={null} pageTitle="Create New Post" />;
  }

  return <EditPostView postId={Number(postId)} />;
}

function EditPostView({ postId }: { postId: number }) {
  const { data } = useSuspenseQuery(postByIdOptions(postId));

  if (!data?.ok || !data?.data) {
    notFound();
  }

  return <PostForm initialData={data.data as Post} pageTitle="Edit Post" />;
}

export function PostDetailView({ postId }: { postId: number }) {
  const { data } = useSuspenseQuery(postByIdOptions(postId));

  if (!data?.ok || !data?.data) {
    notFound();
  }

  return <PostDetails post={data.data as Post} />;
}
