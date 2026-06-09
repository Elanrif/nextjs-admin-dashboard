import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { searchParamsCache } from "@/lib/searchparams";
import UserListingPage from "@/lib/users/components/user-listing";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Users | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Users page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParamsCache.parse(searchParams);

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard>
          <UserListingPage />
        </ComponentCard>
      </div>
    </div>
  );
}
