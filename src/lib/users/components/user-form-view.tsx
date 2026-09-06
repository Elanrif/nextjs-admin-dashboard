"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { User } from "../api/types";
import { userByIdQueryOptions } from "../api/queries/queries.client";
import { UserForm } from "./ui/user-form";
import { ErrorState } from "@/lib/shared/ui/error-state";

type TUserViewPageProps = {
  userId: string;
  onSaved?: () => void;
};

export default function UserFormView({ userId, onSaved }: TUserViewPageProps) {
  if (userId === "new") {
    return (
      <UserForm
        initialData={null}
        pageTitle="Create New User"
        onSaved={onSaved}
      />
    );
  }

  const numericId = Number(userId);
  if (Number.isNaN(numericId)) {
    notFound();
    return null;
  }

  return <EditUserView userId={Number(userId)} onSaved={onSaved} />;
}

function EditUserView({
  userId,
  onSaved,
}: {
  userId: number;
  onSaved?: () => void;
}) {
  const { data } = useSuspenseQuery(userByIdQueryOptions(userId));

  if (!data.ok) {
    if (data.error.status === 404) {
      notFound();
      return null;
    }
    return <ErrorState error={data.error} />;
  }

  return (
    <UserForm
      initialData={data.data as User}
      pageTitle="Edit User"
      onSaved={onSaved}
    />
  );
}
