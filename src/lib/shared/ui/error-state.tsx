"use client";

import { AlertCircle } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { ApiError } from "@/lib/shared/api-error";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  error: ApiError;
  onRetry?: () => void;
  className?: string;
  fullWidth?: boolean;
};

export function ErrorState({
  error,
  onRetry,
  className,
  fullWidth = true,
}: ErrorStateProps) {
  const friendlyError = getFriendlyError(error);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50/50 px-6 py-16 text-center dark:border-red-900/50 dark:bg-red-950/20",
        fullWidth && "col-span-full",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {friendlyError.title}
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {friendlyError.message}
        </p>
      </div>

      {onRetry && (
        <div className="mt-2">
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

function getFriendlyError(error: ApiError) {
  switch (error.status) {
    case 401:
      return {
        title: "Session expirée",
        message: "Veuillez vous reconnecter pour continuer.",
      };

    case 403:
      return {
        title: "Accès refusé",
        message:
          "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
      };

    case 500:
      return {
        title: "Oups ! Une erreur s'est produite",
        message:
          "Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.",
      };

    case 503:
      return {
        title: "Service temporairement indisponible",
        message:
          "Le service est momentanément indisponible. Veuillez réessayer dans quelques instants.",
      };

    default:
      return {
        title: error.error || "Une erreur est survenue",
        message: error.message || "Veuillez réessayer plus tard.",
      };
  }
}