"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  PaginationWithIcon,
  PaginationWithText,
  PaginationWithTextIcon,
} from "@/components/ui/paginations";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";

export default function Paginations() {
  const totalItems = 100;
  const itemsPerPage = 10;

  const { currentPage, goToPage } = usePagination(totalItems, itemsPerPage);

  return (
    <div>
      <PageBreadcrumb pageTitle="Paginations" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Pagination with Text">
          <PaginationWithText
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        </ComponentCard>

        <ComponentCard title="Pagination with Icon">
          <PaginationWithIcon
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        </ComponentCard>

        <ComponentCard title="Pagination with Text and Icon">
          <PaginationWithTextIcon
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
