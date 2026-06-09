"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";

export function UsersTable() {
  const { data } = useSuspenseQuery(usersQueryOptions({}));

  return (
    <div className="space-y-4 p-4">
      <div
        role="alert"
        className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800"
      >
        UI a definir : ce composant affiche uniquement les donnees brutes pour
        le moment.
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Donnees brutes (debug)</h2>
        <pre className="overflow-auto rounded-md bg-gray-100 dark:bg-slate-700 p-3 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
