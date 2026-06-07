"use client";

import { ColumnDef } from "@tanstack/react-table";

// ⚠️ Note : ce fichier est un template de base pour les colonnes d'un tableau de données.
export const columns: ColumnDef<any>[] = [
  {
    id: "column_1",
    accessorKey: "field_1",
    header: "Colonne 1",

    cell: ({ getValue }) => {
      const value = getValue();
      return <span>{String(value ?? "—")}</span>;
    },

    enableSorting: true,
    enableHiding: true,
  },

  {
    id: "column_3",
    accessorFn: (row: any) => {
      // valeur calculée à partir de la ligne (placeholder)
      return row?.field_3 ?? "—";
    },

    header: "Colonne 3",

    cell: ({ getValue }) => {
      return <span>{String(getValue() ?? "—")}</span>;
    },

    enableSorting: true,
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      /*
        `row` est l'objet Row fourni par @tanstack/react-table pour cette ligne.
        Propriétés / utilités courantes :
        - row.original : l'objet de données source (la ligne brute)
        - row.index : l'index numérique de la ligne dans le tableau
        - row.getValue(columnId) : récupère la valeur d'une colonne pour cette ligne
        - row.getAllCells() : tableau des cellules calculées
        Exemple d'utilisation : <button onClick={() => openDetail(row.original.id)}>Voir</button>
        Ici nous n'utilisons pas `row` mais il est fourni si besoin pour implémenter des actions spécifiques.
      */
      return (
        <div>
          {/* actions génériques */}
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
