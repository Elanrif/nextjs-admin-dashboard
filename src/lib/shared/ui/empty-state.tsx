"use client";

import { LucideIcon, Inbox, Plus } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  /** Set to false for empty states inside a table row/cell, where col-span-full or py-16 don't apply. */
  fullWidth?: boolean;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  fullWidth = true,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-16 text-center dark:border-blue-900/50 dark:bg-blue-950/20",
        fullWidth && "col-span-full",
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
        <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>

      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          <Button
            size="sm"
            variant="primary"
            startIcon={<Plus size={16} />}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
