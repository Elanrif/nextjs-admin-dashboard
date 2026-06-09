"use client";

import { Suspense, useEffect, useState } from "react";
import { CommentsTable } from "@/lib/comments/components/comments-table";
import { PostsTable } from "@/lib/posts/components/posts-table";
import { UsersTable } from "@/lib/users/components/users-table";

type Entity = "users" | "posts" | "comments";

const entities: Array<{ label: string; value: Entity }> = [
  { label: "Users", value: "users" },
  { label: "Posts", value: "posts" },
  { label: "Comments", value: "comments" },
];

const entityViews = {
  users: <UsersTable />,
  posts: <PostsTable />,
  comments: <CommentsTable />,
};

export function FeaturesEntitySwitcher() {
  const [activeEntity, setActiveEntity] = useState<Entity>("users");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 0);
  }, []);

  return (
    <div className="mx-auto grid h-[calc(100vh-4rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-6 overflow-hidden lg:grid-cols-[220px_minmax(0,1fr)] lg:grid-rows-1">
      <aside className="self-start rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-8">
        <nav className="grid gap-2" aria-label="Entities">
          {entities.map((entity) => {
            const isActive = entity.value === activeEntity;

            return (
              <button
                key={entity.value}
                type="button"
                onClick={() => setActiveEntity(entity.value)}
                className={`rounded-md px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {entity.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="scrollbar-hidden min-h-0 min-w-0 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isMounted ? (
          <Suspense
            fallback={
              <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                Chargement...
              </div>
            }
          >
            {entityViews[activeEntity]}
          </Suspense>
        ) : null}
      </section>
    </div>
  );
}
