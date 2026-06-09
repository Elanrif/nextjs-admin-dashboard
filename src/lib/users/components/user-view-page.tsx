"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { User } from "../api/types";
import { userByIdOptions } from "../api/queries/queries.client";
import { UserForm } from "./user-form";
import UserDetails from "./user-details";

type TUserViewPageProps = {
  userId: string;
};

export default function UserViewPage({ userId }: TUserViewPageProps) {
  if (userId === "new") {
    return <UserForm initialData={null} pageTitle="Create New User" />;
  }

  return <EditUserView userId={Number(userId)} />;
}

function EditUserView({ userId }: { userId: number }) {
  const { data } = useSuspenseQuery(userByIdOptions(userId));

  if (!data?.ok || !data?.data) {
    notFound();
  }
  return <UserForm initialData={data.data as User} pageTitle="Edit User" />;
}

export function UserDetailView({ userId }: { userId: number }) {
  const { data } = useSuspenseQuery(userByIdOptions(userId));

  if (!data?.ok || !data?.data) {
    notFound();
  }

  return <UserDetails user={data.data as User} />;
}
