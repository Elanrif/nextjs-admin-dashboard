"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "../../api/queries/queries.client";
export function PostsTable() {
  // passé objet vide : {}, car postsQueryOptions attend un paramètre de filtre,
  // mais on veut juste récupérer la liste brute des posts sans filtre pour le moment
  const { data } = useSuspenseQuery(postsQueryOptions({}));

  return (
    <div className="space-y-4 p-4">
      <div
        role="alert"
        className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800"
      >
        ⚠️ UI à définir : ce composant affiche uniquement les données brutes
        pour le moment.
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Données brutes (debug)</h2>
        <pre className="overflow-auto rounded-md bg-gray-100 dark:bg-slate-700  p-3 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
